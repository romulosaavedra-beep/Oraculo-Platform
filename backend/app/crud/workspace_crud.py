from supabase import create_client, Client
from app.core.config import settings
from app.schemas.workspace_schemas import WorkspaceCreate
import uuid

def get_supabase_client() -> Client:
    """
    Cria e retorna um cliente Supabase usando as configurações da aplicação.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def create_workspace(db: Client, *, workspace_in: WorkspaceCreate, user_id: uuid.UUID) -> dict | None:
    """
    Cria um novo workspace no banco de dados para um usuário específico,
    verificando antes se já não existe um com o mesmo nome para o mesmo usuário.
    """
    # Verifica se já existe um workspace com o mesmo nome para este usuário
    existing_workspace_response = db.from_("workspaces") \
        .select("id")\
        .eq("name", workspace_in.name)\
        .eq("user_id", str(user_id))\
        .execute()

    # Se a resposta contiver dados, significa que um workspace duplicado foi encontrado
    if existing_workspace_response.data:
        return None # Retorna None para indicar duplicidade

    # Se não houver duplicata, prossiga com a criação
    workspace_data = workspace_in.model_dump()
    workspace_data['user_id'] = str(user_id)

    response = db.from_("workspaces").insert(workspace_data).execute()

    if response.data:
        return response.data[0]
    
    # Em teoria, não deveria chegar aqui se a inserção falhar por outros motivos,
    # mas é uma boa prática retornar None.
    return None

def get_workspaces_by_user(db: Client, *, user_id: uuid.UUID) -> list[dict]:
    """
    Busca e retorna todos os workspaces pertencentes a um usuário específico.
    """
    response = db.from_("workspaces").select("*").eq("user_id", str(user_id)).execute()
    return response.data or []

def get_documents_by_workspace(db: Client, *, workspace_id: int, user_id: uuid.UUID) -> list[dict]:
    """
    Busca e retorna todos os documentos pertencentes a um workspace específico,
    garantindo que o workspace pertença ao usuário.
    """
    # Primeiro, verificamos se o workspace pertence ao usuário para segurança
    ws_response = db.from_("workspaces")\
        .select("id")\
        .eq("id", str(workspace_id))\
        .eq("user_id", str(user_id))\
        .execute()

    if not ws_response.data:
        return [] # Retorna vazio se o usuário não for dono do workspace

    # Se o usuário for o dono, busca os documentos
    doc_response = db.from_("documents")\
        .select("*")\
        .eq("workspace_id", str(workspace_id))\
        .execute()
        
    return doc_response.data or []

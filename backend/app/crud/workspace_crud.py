from supabase import create_client, Client
from app.core.config import settings
from app.schemas.workspace_schemas import WorkspaceCreate
import uuid

def get_supabase_client() -> Client:
    """
    Cria e retorna um cliente Supabase usando as configurações da aplicação.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

def create_workspace(db: Client, *, workspace_in: WorkspaceCreate, user_id: uuid.UUID) -> dict | None:
    """
    Cria um novo workspace no banco de dados para um usuário específico.
    """
    workspace_data = workspace_in.model_dump()
    workspace_data['user_id'] = str(user_id)

    response = db.from_("workspaces").insert(workspace_data).execute()

    if response.data:
        return response.data[0]
    return None

def get_workspaces_by_user(db: Client, *, user_id: uuid.UUID) -> list[dict]:
    """
    Busca e retorna todos os workspaces pertencentes a um usuário específico.
    """
    response = db.from_("workspaces").select("*").eq("user_id", str(user_id)).execute()
    return response.data or []

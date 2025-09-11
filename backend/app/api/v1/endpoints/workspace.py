from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.workspace_schemas import WorkspaceCreate, WorkspaceRead
from app.schemas.document_schemas import DocumentRead
from app.crud import workspace_crud
from app.tasks import process_document # Importa a tarefa Celery
from supabase import Client
# Mock de dependência de autenticação - será substituído em breve
from app.core.security import get_current_user
from app.crud.workspace_crud import get_supabase_client

router = APIRouter()

@router.post("/", response_model=WorkspaceRead)
def create_workspace_endpoint(
    *,
    workspace_in: WorkspaceCreate,
    db: Client = Depends(get_supabase_client),
    current_user: dict = Depends(get_current_user)
):
    """
    Cria um novo workspace para o usuário autenticado.
    """
    user_id = current_user
    if not user_id:
        raise HTTPException(status_code=403, detail="Usuário não autenticado.")

    workspace = workspace_crud.create_workspace(db, workspace_in=workspace_in, user_id=user_id)
    if not workspace:
        raise HTTPException(
            status_code=409, 
            detail=f"Já existe um workspace com o nome '{workspace_in.name}'."
        )
    return workspace

@router.get("/", response_model=List[WorkspaceRead])
def list_workspaces_endpoint(
    *,
    db: Client = Depends(get_supabase_client),
    current_user: dict = Depends(get_current_user)
):
    """
    Lista todos os workspaces do usuário autenticado.
    """
    user_id = current_user
    if not user_id:
        raise HTTPException(status_code=403, detail="Usuário não autenticado.")

    workspaces = workspace_crud.get_workspaces_by_user(db, user_id=user_id)
    return workspaces


@router.get("/{workspace_id}/documents", response_model=List[DocumentRead])
def list_workspace_documents_endpoint(
    *,
    workspace_id: int,
    db: Client = Depends(get_supabase_client),
    current_user: dict = Depends(get_current_user)
):
    """
    Lista todos os documentos de um workspace específico.
    """
    user_id = current_user
    if not user_id:
        raise HTTPException(status_code=403, detail="Usuário não autenticado.")

    documents = workspace_crud.get_documents_by_workspace(
        db, workspace_id=workspace_id, user_id=user_id
    )
    # A função do CRUD já garante a segurança, retornando [] se o acesso for negado.
    return documents

@router.post("/process-document/{document_id}", status_code=202)
def process_document_endpoint(
    *,
    document_id: int,
    db: Client = Depends(get_supabase_client),
    current_user: str = Depends(get_current_user)
):
    """
    Inicia o processamento assíncrono de um documento.
    """
    # Verifica se o documento existe e pertence ao usuário
    doc_res = db.table('documents').select('id', 'user_id').eq('id', document_id).single().execute()
    if not doc_res.data:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")

    if doc_res.data['user_id'] != current_user:
        raise HTTPException(status_code=403, detail="Acesso negado. O documento não pertence ao usuário.")

    # Dispara a tarefa Celery
    process_document.delay(document_id)

    return {"message": "O processamento do documento foi iniciado."}

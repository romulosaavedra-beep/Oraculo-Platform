from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.workspace_schemas import WorkspaceCreate, WorkspaceRead
from app.crud import workspace_crud
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
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=403, detail="Usuário não autenticado.")

    workspace = workspace_crud.create_workspace(db, workspace_in=workspace_in, user_id=user_id)
    if not workspace:
        raise HTTPException(status_code=400, detail="Não foi possível criar o workspace.")
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
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=403, detail="Usuário não autenticado.")

    workspaces = workspace_crud.get_workspaces_by_user(db, user_id=user_id)
    return workspaces

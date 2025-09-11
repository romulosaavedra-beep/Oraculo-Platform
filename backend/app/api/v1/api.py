# backend/app/api/v1/api.py
from fastapi import APIRouter
from .endpoints import auth, workspace, chat, project_analysis

api_router = APIRouter()

# Adiciona todas as nossas rotas ao roteador principal da API
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(workspace.router, prefix="/workspaces", tags=["Workspaces"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(project_analysis.router, prefix="/analysis", tags=["Analysis"])
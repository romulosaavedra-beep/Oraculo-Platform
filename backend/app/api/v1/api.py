from fastapi import APIRouter
from app.api.v1.endpoints import workspace, webhook

api_router = APIRouter()

# Inclui as rotas definidas em workspace.py no roteador principal.
# O prefix="/workspaces" significa que todas as rotas de lá começarão com /workspaces
# (ex: /api/v1/workspaces/).
# O "tags" agrupa os endpoints na documentação da API.
api_router.include_router(workspace.router, prefix="/workspaces", tags=["Workspaces"])
api_router.include_router(webhook.router, prefix="/webhook", tags=["Webhook"])

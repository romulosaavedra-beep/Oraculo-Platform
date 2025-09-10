from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.api import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configuração do CORS
# Isso permite que o frontend (ex: http://localhost:3000)
# se comunique com o backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restrinja para o domínio do seu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health", tags=["Health"])
def health_check():
    """Verifica se a API está funcionando."""
    return {"status": "ok"}

# Inclui todas as rotas da nossa API definidas no api_router
app.include_router(api_router, prefix=settings.API_V1_STR)
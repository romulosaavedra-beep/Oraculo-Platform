from fastapi import FastAPI

# Esta é a linha que estava faltando!
# Ela cria a instância da nossa aplicação web.
app = FastAPI(
    title="Oráculo API",
    description="API para a plataforma de Workspaces de IA Oráculo.",
    version="0.1.0",
)

# Este é um "endpoint", uma URL que podemos visitar.


@app.get("/api/v1/health", tags=["Health"])
def health_check():
    """Verifica se a API está funcionando."""
    return {"status": "ok"}

# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Carrega e valida todas as variáveis de ambiente necessárias para o backend.
    """
    # Supabase
    SUPABASE_URL: str
    # CORREÇÃO: O backend precisa da SERVICE_KEY, não da ANON_KEY
    SUPABASE_SERVICE_KEY: str
    SUPABASE_JWT_SECRET: str

    # Google Gemini
    # CORREÇÃO: Usa o nome customizado da variável
    ORACULO_GEMINI_API_KEY: str

    # JWT Security (usado pelo FastAPI, não pelo Supabase Auth)
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # Redis / Celery
    REDIS_URL: str
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str

    # Database (Listener)
    DATABASE_URL: str

    # Configuração da Aplicação
    PROJECT_NAME: str
    API_V1_STR: str

    # Configuração para ler do arquivo .env
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

# Instância única das configurações
settings = Settings()
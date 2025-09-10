# backend/app/core/security.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client

from app.core.config import settings

# OAuth2PasswordBearer extrai o token do cabeçalho da requisição.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# Cria uma única instância do cliente Supabase para ser reutilizada.
supabase_client: Client = create_client(
    settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Valida um token JWT diretamente com o Supabase para obter o usuário atual.
    Esta é a abordagem mais segura e robusta.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Usa a instância do cliente pré-configurada para validar o token
        user_response = supabase_client.auth.get_user(token)
        user = user_response.user

        if user is None:
            raise credentials_exception

        return str(user.id)

    except Exception as e:
        # Captura qualquer erro (token inválido, expirado, erro de rede, etc.)
        print(f"DEBUG: Exceção em get_current_user: {e}")
        raise credentials_exception
    
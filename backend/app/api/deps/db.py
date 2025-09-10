from typing import Generator

from supabase import create_client, Client

from app.core.config import settings

# Criação do cliente Supabase. 
# Idealmente, a criação do cliente pode ser feita uma vez e reutilizada,
# mas para seguir o padrão de dependência do FastAPI que gerencia o ciclo de vida,
# vamos instanciá-lo dentro da função de dependência.

def get_db() -> Generator[Client, None, None]:
    """
    Dependência do FastAPI para obter uma sessão do banco de dados Supabase.

    Esta função geradora cria um cliente Supabase para cada requisição
    que a utiliza como dependência.

    Yields:
        Um cliente Supabase pronto para ser usado.
    """
    supabase_client: Client = create_client(
        settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY
    )
    try:
        yield supabase_client
    finally:
        # O cliente Supabase em Python gerencia suas próprias conexões.
        # Não há um método explícito como `db.close()` que precisamos chamar.
        # O bloco finally está aqui para manter o padrão de design de 
        # dependências que gerenciam recursos, garantindo um código limpo e previsível.
        pass

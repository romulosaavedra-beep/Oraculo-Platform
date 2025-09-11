# backend/app/schemas/document_schemas.py
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

# Este é o schema que o seu endpoint de listagem deve retornar.
# Ele corresponde à estrutura da sua tabela `documents`.
class DocumentRead(BaseModel):
    id: int  # CORRIGIDO: O ID é um número (bigint/int8)
    name: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
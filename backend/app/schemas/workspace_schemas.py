from pydantic import BaseModel
from datetime import datetime
import uuid

# Schema Base: Campos compartilhados por outros schemas
class WorkspaceBase(BaseModel):
    name: str
    system_prompt: str | None = None

# Schema para Criação: O que a API espera receber no POST
class WorkspaceCreate(WorkspaceBase):
    pass # Herda todos os campos de WorkspaceBase

# Schema para Leitura: O que a API vai retornar no GET
# Inclui campos que são gerados pelo banco de dados (id, created_at, user_id)
class WorkspaceRead(WorkspaceBase):
    id: int
    user_id: uuid.UUID
    created_at: datetime

    class Config:
        # Ajuda o Pydantic a converter objetos do banco de dados (que não são dicts)
        # para o formato do schema.
        from_attributes = True

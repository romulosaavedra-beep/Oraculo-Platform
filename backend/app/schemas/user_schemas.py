from pydantic import BaseModel, EmailStr
from uuid import UUID

# Schema base para o usuário


class UserBase(BaseModel):
    email: EmailStr

# Schema para a criação de um usuário (herda de UserBase)


class UserCreate(UserBase):
    password: str

# Schema para a leitura de um usuário (herda de UserBase)
# Inclui campos que são gerados pelo banco de dados


class User(UserBase):
    id: UUID
    is_active: bool = True

    class Config:
        from_attributes = True

# Contexto da Infraestrutura Externa do Projeto Oráculo

Este documento descreve a configuração de todos os serviços externos e da infraestrutura na nuvem que suportam o Projeto Oráculo. Ele deve ser usado como a fonte da verdade para entender como os diferentes serviços se conectam.

## 1. Supabase (Backend-as-a-Service)

O Supabase é nosso principal serviço de backend, fornecendo banco de dados, autenticação, armazenamento e funções.

-   **Projeto:** `Oraculo Platform`
-   **URL do Projeto:** `https://gxgljcwlsbzmibsnbqwb.supabase.co`
-   **Status:** Totalmente configurado e operacional.

### 1.1. Banco de Dados (PostgreSQL)

O banco de dados já está configurado com as seguintes tabelas e políticas:

-   **Tabela `workspaces`:**
    -   **Colunas:** `id (int8)`, `created_at`, `name (text)`, `user_id (uuid)`, `system_prompt (text)`.
    -   **RLS (Row Level Security):** Habilitada.
        -   **Política SELECT:** Permite que usuários leiam apenas os workspaces cujo `user_id` corresponda ao seu `auth.uid()`.
        -   **Política INSERT:** Permite que usuários criem workspaces apenas se o `user_id` corresponder ao seu `auth.uid()`.

-   **Tabela `documents`:**
    -   **Colunas:** `id (int8)`, `created_at`, `name (text)`, `path (text)`, `status (text)`, `workspace_id (int8)`, `user_id (uuid)`.
    -   **RLS:** Habilitada com políticas de SELECT e INSERT baseadas no `user_id`.

-   **Tabela `document_chunks`:**
    -   **Colunas:** `id (int8)`, `created_at`, `content (text)`, `embedding (vector, 768)`, `metadata (jsonb)`, `document_id (int8)`, `workspace_id (int8)`, `user_id (uuid)`.
    -   **RLS:** Habilitada com políticas de SELECT e INSERT baseadas no `user_id`.

-   **Tabela `chat_messages`:**
    -   **Colunas:** `id (int8)`, `created_at`, `workspace_id (int8)`, `role (text)`, `content (text)`, `user_id (uuid)`.
    -   **RLS:** Habilitada com políticas de SELECT e INSERT baseadas no `user_id`.

-   **Função SQL `match_document_chunks`:**
    -   **Status:** Já existe e está funcional. Ela recebe um embedding e retorna os chunks mais similares.

### 1.2. Autenticação (Supabase Auth)

-   **Status:** Operacional. O frontend já utiliza o Supabase Auth para login de usuários.

### 1.3. Armazenamento (Supabase Storage)

-   **Bucket:** `workspaces_data`
-   **Status:** Operacional.
-   **Políticas:** Configurado para permitir que qualquer usuário autenticado (`auth.role() = 'authenticated'`) possa fazer upload (INSERT) e ler (SELECT) arquivos.

## 2. Render (Plataforma de Hospedagem)

O Render é usado para hospedar os componentes do nosso backend customizado.

-   **Status:** Parcialmente configurado.

### 2.1. Serviço Redis

-   **Nome:** `oraculo-redis`
-   **Status:** **Live** e operacional.
-   **Conexão:**
    -   **URL Interna:** Usada para comunicação entre serviços DENTRO do Render.
    -   **URL Externa:** Usada para desenvolvimento local. Requer que o IP do desenvolvedor seja adicionado à "Access Control List".

### 2.2. Serviço Web (API FastAPI)

-   **Nome:** `oraculo-api`
-   **Status:** **Live**, mas rodando um código esqueleto. O deploy a partir do GitHub está configurado.
-   **Configuração:**
    -   **Root Directory:** `backend`
    -   **Build Command:** `poetry install`
    -   **Start Command:** `poetry run uvicorn app.main:app --host 0.0.0.0 --port 10000`

## 3. GitHub (Controle de Versão)

-   **Repositório:** `romulosaavedra-beep/Oraculo-Platform`
-   **Branch Principal:** `main`
-   **Status:** O repositório está criado, o código local está sincronizado, e a integração com o Render está funcionando.

---

## Instruções para a IA

-   Use este documento como a fonte da verdade sobre o estado da nossa infraestrutura.
-   Ao escrever código para o backend, assuma que as tabelas e funções do Supabase já existem conforme descrito.
-   Ao configurar o backend, use as variáveis de ambiente para se conectar a esses serviços.

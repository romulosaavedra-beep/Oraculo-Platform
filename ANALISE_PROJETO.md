# Análise e Relatório de Debug do Projeto Oráculo

Data da Análise: 09/09/2025

## Resumo Geral

O projeto "Oráculo" encontra-se em um estágio inicial de desenvolvimento. A análise revelou que o **backend é atualmente um esqueleto não funcional**, enquanto o **frontend possui uma base de autenticação, mas com falhas arquiteturais significativas** que precisam ser corrigidas.

A prioridade máxima é construir a fundação do backend para que o frontend tenha uma API para consumir. Em paralelo ou logo após, o frontend deve ser refatorado para adotar as bibliotecas de gerenciamento de estado corretas e corrigir as inconsistências.

---

## I. Análise do Backend (Python / FastAPI)

O backend está estruturado em pastas, mas a lógica essencial está ausente. Ele não está em um estado funcional.

### Problemas Críticos:

1.  **Configuração de Ambiente Ausente**
    *   **Arquivo:** `backend/app/core/config.py`
    *   **Problema:** O arquivo está vazio. Não há código para carregar variáveis de ambiente (como strings de conexão do banco, chaves de API do Supabase e do Gemini). Isso impede a aplicação de sequer iniciar corretamente e representa um risco de segurança se segredos forem codificados em outros lugares.
    *   **Solução Recomendada:** Implementar uma classe de `Settings` usando `pydantic-settings` para carregar e validar as variáveis de um arquivo `.env`.

2.  **Schemas de Dados (Pydantic) Inexistentes**
    *   **Arquivo:** `backend/app/schemas/workspace_schemas.py` (e outros no mesmo diretório)
    *   **Problema:** Os arquivos de schema estão vazios. O FastAPI depende dos schemas Pydantic para validação de dados de entrada/saída, serialização e para a geração automática da documentação da API. Sem eles, a API não tem um contrato de dados definido.
    *   **Solução Recomendada:** Definir os schemas Pydantic para cada entidade, começando com `WorkspaceCreate`, `WorkspaceRead`, e `User`.

3.  **Lógica de Negócio (CRUD) Não Implementada**
    *   **Arquivo:** `backend/app/crud/workspace_crud.py`
    *   **Problema:** O arquivo está vazio. Não há funções para realizar operações de banco de dados (Criar, Ler, Atualizar, Deletar).
    *   **Solução Recomendada:** Implementar as funções CRUD para workspaces, utilizando SQLAlchemy ou o cliente Supabase para interagir com o banco de dados.

4.  **Endpoints da API Vazios e Desconectados**
    *   **Arquivos:** `backend/app/api/v1/endpoints/workspace.py`, `backend/app/api/v1/api.py`, `backend/app/main.py`
    *   **Problema:** O endpoint do workspace está vazio. O roteador principal (`api.py`) não inclui o roteador do workspace. E a aplicação principal (`main.py`) não inclui o roteador principal da API. A API não tem rotas funcionais.
    *   **Solução Recomendada:** Implementar as rotas nos arquivos de endpoint, incluir esses roteadores no `api.py`, e então incluir o `api_router` principal no `app` do `main.py`.

---

## II. Análise do Frontend (Next.js / TypeScript)

O frontend tem funcionalidades visíveis, como login e listagem de workspaces, mas possui problemas estruturais que levarão a bugs e dificuldades de manutenção.

### Problemas Críticos:

1.  **Inconsistência e Conflito no Cliente Supabase**
    *   **Arquivo:** `frontend/lib/supabase.ts` e `frontend/package.json`
    *   **Problema:** O `package.json` declara a dependência `@supabase/supabase-js`. No entanto, o arquivo `supabase.ts` tenta usar `createClientComponentClient` que pertence ao pacote `@supabase/auth-helpers-nextjs`. Esses pacotes têm propósitos diferentes e essa inconsistência causará erros de execução. Além disso, o `AuthContext` usa uma instância direta enquanto as páginas usam uma função, o que pode levar a múltiplos clientes e estados dessincronizados.
    *   **Solução Recomendada:**
        1.  Padronizar o uso do `@supabase/auth-helpers-nextjs` para toda a aplicação, pois ele é otimizado para o App Router do Next.js.
        2.  Adicionar a dependência correta: `npm install @supabase/auth-helpers-nextjs`.
        3.  Garantir que uma única forma de obter o cliente Supabase seja usada em toda a aplicação para consistência.

### Problemas de Arquitetura (Médio-Alto Risco):

2.  **Gerenciamento de Estado do Servidor Inadequado**
    *   **Arquivos:** `frontend/app/(dashboard)/workspaces/page.tsx`, `frontend/app/(dashboard)/workspaces/[workspaceId]/page.tsx`
    *   **Problema:** Os componentes usam o padrão `useState` + `useEffect` para buscar dados. Conforme definido no `GEMINI.md`, esta tarefa deve ser gerenciada pelo **React Query (TanStack Query)**. A abordagem atual não oferece cache, revalidação em foco de janela, ou tratamento de estado otimista, levando a mais código manual e uma experiência de usuário inferior.
    *   **Solução Recomendada:**
        1.  Instalar o TanStack Query: `npm install @tanstack/react-query`.
        2.  Configurar um `QueryClientProvider` no `layout.tsx`.
        3.  Refatorar os componentes de página para usar o hook `useQuery` para buscar dados, eliminando a necessidade de `useState` e `useEffect` para essa finalidade.

3.  **Comunicação com o Backend Faltando**
    *   **Arquivo:** `frontend/services/apiClient.ts`
    *   **Problema:** O arquivo está vazio. Não há um cliente HTTP (como o `axios`) configurado para se comunicar com a API do backend (Python). Atualmente, o frontend só se comunica com o Supabase.
    *   **Solução Recomendada:** Configurar uma instância do `axios` neste arquivo. Esta instância deve ser pré-configurada com a URL base da API do backend e para incluir o token de autenticação (JWT do Supabase) em cada requisição.

4.  **Biblioteca de Componentes de UI Não Instalada**
    *   **Arquivo:** `frontend/package.json`
    *   **Problema:** O `GEMINI.md` especifica o uso de `shadcn/ui`, mas suas dependências (`class-variance-authority`, `clsx`, `lucide-react`, etc.) não estão no `package.json`. Os componentes de UI existentes parecem ser estilizados manualmente.
    *   **Solução Recomendada:** Inicializar o `shadcn/ui` no projeto (`npx shadcn-ui@latest init`) e começar a usar seus componentes para garantir consistência visual e acessibilidade.

---

## III. Próximos Passos Recomendados

1.  **Backend (Prioridade 1):**
    1.  Implementar `core/config.py` com `pydantic-settings`.
    2.  Definir os schemas Pydantic em `schemas/`.
    3.  Implementar as funções em `crud/workspace_crud.py`.
    4.  Criar os endpoints em `endpoints/workspace.py`.
    5.  Conectar os roteadores em `api.py` e `main.py`.

2.  **Frontend (Prioridade 2):**
    1.  Corrigir a inconsistência do cliente Supabase, padronizando o uso de `@supabase/auth-helpers-nextjs`.
    2.  Instalar e configurar o TanStack Query e refatorar as páginas para usá-lo.
    3.  Configurar o `apiClient.ts` com `axios`.
    4.  (Opcional, mas recomendado) Inicializar `shadcn/ui` para futuros componentes.

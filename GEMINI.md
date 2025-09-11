# Contexto do Projeto Oráculo (GEMINI.md - Raiz)

## Sobre o Projeto Oráculo

Você é meu parceiro de desenvolvimento para o "Projeto Oráculo". Estamos construindo uma plataforma de Workspaces de IA, conforme detalhado no **Documento Mestre v10.0**. A visão é criar uma ferramenta onde os usuários possam conversar com seus próprios documentos de forma segura, personalizada e dinâmica. O projeto é open source (licença MIT) e construído com uma arquitetura "bootstrapped", visando escalabilidade futura.

## Minha Persona (O Usuário)

**É crucial que você entenda isto:** Eu sou o arquiteto e visionário do projeto, mas **não sou um programador experiente**. Minha principal ferramenta para codificar será você, o Gemini CLI. Portanto, suas explicações devem ser claras, didáticas e sem assumir conhecimento prévio de jargões complexos. Pense em mim como um "Product Manager técnico" que precisa de um "Desenvolvedor Sênior" (você) para executar a visão.

## Sua Persona (Gemini CLI)

Sua persona para este projeto é a de um **Mentor Sênior Full-Stack**. Você é:
- **Didático:** Explique o *porquê* por trás de cada decisão de código. Se você usar um padrão de projeto, explique o que é e por que é a escolha certa aqui.
- **Paciente:** Esteja preparado para detalhar conceitos básicos se necessário.
- **Proativo:** Não espere apenas por instruções. Se você vir uma maneira melhor de fazer algo, sugira-a. Se notar um risco de segurança ou um potencial gargalo de performance, alerte-me.
- **Completo:** Sempre forneça o código completo para um arquivo, a menos que eu peça especificamente por um trecho. Isso evita que eu tenha que juntar pedaços de código.

## Nossas Regras de Colaboração

1.  **Explique Antes de Codificar:** Para qualquer tarefa nova, comece com um breve plano. Ex: "Ok, para criar o endpoint de login, primeiro vamos definir o schema Pydantic, depois a rota na API, e por fim a função CRUD. Vamos começar com o schema."
2.  **Segurança em Primeiro Lugar:** Sempre que lidarmos com dados do usuário, autenticação ou chaves de API, destaque as melhores práticas de segurança. Nunca escreva segredos diretamente no código.
3.  **Refira-se ao Documento Mestre:** Nossas decisões devem ser consistentes com o "Documento Mestre v9.2". Se uma solicitação minha desviar do plano, questione-a e peça esclarecimentos.
4.  **Testes são Inegociáveis:** Lembre-me constantemente da importância dos testes. Ao criar uma nova funcionalidade, sugira como poderíamos testá-la.
5.  **Código Limpo e Comentado:** O código deve ser legível. Adicione comentários onde a lógica for complexa, explicando a intenção.

## Stack Tecnológica Geral

- **Backend:** Python 3.11+, FastAPI, Celery, Redis, Poetry
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Banco de Dados & Auth:** Supabase (PostgreSQL com pgvector)
- **Hospedagem:** Render (Backend, Worker, Redis) e Vercel (Frontend)
- **IA:** Google Gemini API

## Projeto Oráculo: Documento Mestre v10.0 (Plataforma de Workspaces de IA)

---

## Índice

1.  **Introdução e Visão Geral**
    *   1.1. Propósito do Documento
    *   1.2. Visão e Missão do Produto
    *   1.3. Filosofia e Princípios Norteadores
2.  **Arquitetura e Lógica do Produto (v10.0)**
    *   2.1. O Conceito Central: Workspace "Vivo" e Personalizável
    *   2.2. Diagrama de Arquitetura Lógica: O Pipeline Assíncrono
    *   2.3. Lógica de Autenticação e Estado Global (Context Provider)
    *   2.4. Detalhamento dos Componentes e Tecnologias
3.  **Estrutura de Arquivos do Projeto (v10.0)**
    *   3.1. Visão Geral da Estrutura Raiz
    *   3.2. Detalhamento do Diretório `backend/`
    *   3.3. Detalhamento do Diretório `frontend/`
4.  **Configuração do Banco de Dados (Supabase)**
    *   4.1. Tabela `workspaces`
    *   4.2. Relações (Foreign Keys)
    *   4.3. Políticas de Segurança (Row Level Security)
5.  **Roteiro de Implementação Faseado (Revisado)**
    *   5.1. Fase I: Fundação Robusta (Concluída)
    *   5.2. Fase II: O Workspace Funcional (MVP)
    *   5.3. Fase III: UX Avançada e Integração de Workflow
    *   5.4. Fase IV: Inteligência Proativa e Automação
6.  **Detalhamento da Fase II: O Workspace Funcional (MVP)**
    *   6.1. Upload de Arquivos (Manual)
    *   6.2. Lógica do RAG Contextual por Workspace
    *   6.3. Interface de Chat
7.  **Configuração do Ambiente de Desenvolvimento**
    *   7.1. Pré-requisitos de Software
    *   7.2. Configuração do Backend (com Poetry)
    *   7.3. Configuração do Frontend (com Next.js e Supabase Auth Helpers)
8.  **Modelo de Negócio e Estratégia de Monetização**
    *   8.1. Modelo Híbrido: Open Source Core + Serviço Cloud Gerenciado
    *   8.2. Proposta de Valor por Nível de Acesso
9.  **Anexo A: Guia de Colaboração com IA (GEMINI.md)**
10. **Anexo B: Script de Criação da Estrutura do Projeto (v10.0)**

---

## 1. Introdução e Visão Geral

### 1.1. Propósito do Documento
Este documento é a fonte canônica de verdade para o projeto "Oráculo". Ele serve como um guia técnico e estratégico completo, projetado para ser executado por um arquiteto de projeto em parceria com um assistente de IA (como o Gemini CLI). Ele detalha a visão, arquitetura, funcionalidades e plano de implementação, incorporando as lições aprendidas durante a construção da fundação do projeto.

### 1.2. Visão e Missão do Produto
*   **Visão:** Ser a plataforma líder em Workspaces de Inteligência Artificial, permitindo que profissionais transformem seus universos de documentos dinâmicos em bases de conhecimento interativas, personalizadas e acionáveis.
*   **Missão:** Capacitar os usuários a extrair insights, auditar informações e automatizar tarefas complexas, conversando com seus próprios dados em um ambiente privado, estruturado e sempre sincronizado.

### 1.3. Filosofia e Princípios Norteadores
*   **Princípio #1: O Workspace é o Produto.** Nosso diferencial é a experiência superior de interagir com os dados do usuário de forma segura, intuitiva e dinâmica.
*   **Princípio #2: Confiança Explícita via Citação.** Cada afirmação da IA deve ser rastreável até a fonte exata.
*   **Princípio #3: Segurança e Privacidade por Design.** O isolamento dos dados do usuário (multi-tenancy) via RLS é um pré-requisito fundamental e inegociável.
*   **Princípio #4: Bootstrapped & Enterprise Ready.** A arquitetura é implementada com custo mínimo, mas projetada para escalar.
*   **Princípio #5: Open Source por Defeito.** O código-fonte é aberto (licença MIT) para fomentar confiança, comunidade e permitir auto-hospedagem.
*   **Princípio #6: Desenvolvimento Assistido por IA.** O projeto é construído em uma parceria explícita entre o arquiteto humano e um assistente de IA.

---

## 2. Arquitetura e Lógica do Produto (v10.0)

### 2.1. O Conceito Central: Workspace "Vivo" e Personalizável
O Workspace é um ambiente de trabalho isolado que contém:
*   **Fonte de Dados:** Inicialmente via upload manual, evoluindo para sincronização com a nuvem.
*   **Sistema de Instrução:** Uma configuração onde o usuário define a persona e as regras da IA para aquele workspace.
*   **Chat de Análise:** A interface de conversação para interagir com a IA sobre os documentos.

### 2.2. Diagrama de Arquitetura Lógica: O Pipeline Assíncrono
A ingestão de documentos será assíncrona para não bloquear a interface do usuário.
1.  **Upload:** Frontend envia o arquivo para o Supabase Storage.
2.  **Notificação:** Uma função de borda (Edge Function) ou webhook notifica o **Backend (FastAPI)**.
3.  **Enfileiramento:** O Backend enfileira uma tarefa de processamento no **Redis**.
4.  **Processamento:** Um **Worker (Celery)** pega a tarefa, processa o arquivo (chunking, embeddings) e salva no banco de dados.
5.  **Feedback:** O Frontend é notificado da conclusão via **Supabase Realtime**.

### 2.3. Lógica de Autenticação e Estado Global (Context Provider)
A autenticação é gerenciada pelo Supabase Auth. Para evitar problemas de estado inconsistente entre as páginas, a aplicação frontend utiliza o padrão **Context Provider**.
*   **`AuthProvider`:** Um componente de alto nível em `app/layout.tsx` que envolve toda a aplicação.
*   **`onAuthStateChange`:** O provedor usa este listener para saber, em tempo real, se um usuário está logado ou não.
*   **`useAuth` Hook:** Componentes filhos (como a página de workspaces) usam este hook customizado para acessar o estado de autenticação (usuário, status de carregamento) sem precisar de lógica própria, garantindo uma única fonte da verdade.

### 2.4. Detalhamento dos Componentes e Tecnologias
| Componente | Tecnologia Principal | Provedor / Hospedagem | Bibliotecas / Ferramentas Chave |
| :--- | :--- | :--- | :--- |
| **Frontend (Cliente)** | Next.js 14+ (App Router) | Vercel | TypeScript, Tailwind CSS, **`@supabase/auth-helpers-nextjs`**, Zustand |
| **Backend (API)** | Python 3.11+ / FastAPI | Render (Web Service) | Uvicorn, Pydantic, **Poetry** |
| **Fila de Tarefas** | Redis | Render (Redis) | - |
| **Worker Assíncrono** | Celery | Render (Background Worker)| Celery, Redis, PyMuPDF |
| **Banco de Dados & Auth** | PostgreSQL 15+ | Supabase | **pgvector**, Row Level Security |
| **Inteligência (LLM)** | Gemini 1.5 Pro & Flash | Google AI / GCP | - |

---

## 3. Estrutura de Arquivos do Projeto (v10.0)

### 3.1. Visão Geral da Estrutura Raiz
```
oraculo-plataforma/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

### 3.2. Detalhamento do Diretório `backend/`
```
backend/
├── app/
│   ├── main.py
│   └── ...
├── .env.example
├── pyproject.toml
└── README.md
```

### 3.3. Detalhamento do Diretório `frontend/`
```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── workspaces/
│   │   │   ├── [workspaceId]/page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── auth/LogoutButton.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   └── supabase.ts
└── ...
```

---

## 4. Configuração do Banco de Dados (Supabase)

### 4.1. Tabela `workspaces`
| Nome da Coluna | Tipo | Configuração Chave |
| :--- | :--- | :--- |
| `id` | `int8` | Chave Primária, Gerado |
| `created_at` | `timestamptz` | Padrão: `now()` |
| `name` | `text` | - |
| `user_id` | `uuid` | **Valor Padrão: `auth.uid()`** |
| `system_prompt`| `text` | Nulável |

### 4.2. Relações (Foreign Keys)
*   A coluna `workspaces.user_id` tem uma relação de chave estrangeira com `auth.users.id`.

### 4.3. Políticas de Segurança (Row Level Security)
A RLS **deve** estar habilitada para a tabela `workspaces`.
*   **Política de SELECT:**
    *   **Nome:** `Usuários podem ver seus próprios workspaces`
    *   **Comando:** `SELECT`
    *   **Expressão `USING`:** `auth.uid() = user_id`
*   **Política de INSERT:**
    *   **Nome:** `Usuários podem criar workspaces`
    *   **Comando:** `INSERT`
    *   **Expressão `WITH CHECK`:** `auth.uid() = user_id`

---

## 5. Roteiro de Implementação Faseado (Revisado)

### 5.1. Fase I: Fundação Robusta (Concluída)
*   **Objetivo:** Configurar o ambiente de desenvolvimento, implementar um fluxo de autenticação seguro e a funcionalidade CRUD básica para workspaces.
*   **Entregas:**
    *   Ambiente local funcional (Frontend + Backend).
    *   Login, Logout e proteção de rotas.
    *   Criação, listagem e visualização de workspaces.
    *   Configuração correta do banco de dados e RLS.

### 5.2. Fase II: O Workspace Funcional (MVP)
*   **Objetivo:** Implementar a funcionalidade principal do produto: a capacidade de conversar com documentos dentro de um workspace.
*   **Próximos Passos:**
    *   Implementar upload de arquivos (manual) para o Supabase Storage.
    *   Configurar o backend e o worker para processar os arquivos (ingestão assíncrona).
    *   Construir a interface de chat dentro da página `[workspaceId]`.
    *   Implementar a lógica de RAG (Retrieval-Augmented Generation) no backend.

### 5.3. Fase III: UX Avançada e Integração de Workflow
*   **Objetivo:** Melhorar a usabilidade e integrar o Oráculo ao fluxo de trabalho do usuário.
*   **Funcionalidades:** Sincronização com Google Drive, templates de workspace, implementação do "Sistema de Instrução".

### 5.4. Fase IV: Inteligência Proativa e Automação
*   **Objetivo:** Transformar o Oráculo de uma ferramenta reativa para um parceiro proativo.
*   **Funcionalidades:** Agente Autônomo (human-in-the-loop), Engenheiro de Prompt Assistido por IA.

---

## 6. Detalhamento da Fase II: O Workspace Funcional (MVP)

### 6.1. Upload de Arquivos (Manual)
*   **Frontend:** Criar um componente `FileUploader` na página `[workspaceId]` que permite ao usuário selecionar um ou mais arquivos.
*   **Lógica:** O componente usará o cliente Supabase para fazer o upload do arquivo diretamente para um bucket no Supabase Storage, em uma pasta específica para aquele `workspaceId`.

### 6.2. Lógica do RAG Contextual por Workspace
*   **Backend:** Criar um endpoint `/chat` que recebe uma pergunta e um `workspaceId`.
*   **Busca:** O backend busca na tabela `document_chunks` por fragmentos de texto que correspondam à pergunta e que pertençam ao `workspaceId` especificado.
*   **Prompt:** O backend constrói um prompt para o Gemini, incluindo o contexto recuperado e a pergunta do usuário.
*   **Resposta:** O backend retorna a resposta gerada pela IA para o frontend.

### 6.3. Interface de Chat
*   **Frontend:** Criar um componente `ChatInterface` na página `[workspaceId]`.
*   **Funcionalidade:** Manterá o histórico da conversa, exibirá as mensagens do usuário e da IA, e mostrará as fontes/citações para as respostas da IA.

---

## 7. Configuração do Ambiente de Desenvolvimento

### 7.1. Pré-requisitos de Software
*   Node.js v20+, Python v3.11+, Git, Docker, **Poetry**.

### 7.2. Configuração do Backend (com Poetry)
1.  Navegue até `backend/`.
2.  Instale o Poetry se necessário.
3.  Execute `poetry install` para criar o ambiente virtual e instalar as dependências.
4.  Para rodar o servidor: `poetry run uvicorn app.main:app --reload`.

### 7.3. Configuração do Frontend (com Next.js e Supabase Auth Helpers)
1.  Navegue até `frontend/`.
2.  Execute `npm install` para instalar as dependências, incluindo `@supabase/auth-helpers-nextjs` e `@supabase/supabase-js`.
3.  Renomeie `.env.local.example` para `.env.local` e preencha com as chaves do Supabase.
4.  Para rodar o servidor: `npm run dev`.

---

## 8. Modelo de Negócio e Estratégia de Monetização
(Seção inalterada da v9.2)

---

## 9. Anexo A: Guia de Colaboração com IA (GEMINI.md)
Para otimizar o desenvolvimento assistido por IA, três arquivos `GEMINI.md` devem ser criados:
1.  **`oraculo-plataforma/GEMINI.md` (Raiz):** Define a persona do desenvolvedor (não-experiente), a persona da IA (Mentor Sênior), as regras de colaboração e a stack tecnológica geral.
2.  **`backend/GEMINI.md`:** Adiciona contexto específico do backend (FastAPI, Poetry, Celery) e padrões de código Python.
3.  **`frontend/GEMINI.md`:** Adiciona contexto específico do frontend (Next.js App Router, TypeScript, Tailwind, `useAuth` hook) e padrões de código TypeScript/React.

---

Estamos prontos para construir algo incrível juntos.
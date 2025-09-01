# oraculo-plataforma

Este documento foi meticulosamente elaborado para ser seu guia canônico. Ele não apenas detalha o "o quê" e o "porquê", mas também o "como", considerando que sua execução será uma parceria entre você e uma IA de desenvolvimento como o Gemini CLI. A linguagem é intencionalmente clara e as justificativas técnicas são explícitas para facilitar esse diálogo.

Este é o plano que transformará a visão do Oráculo em realidade.

Projeto Oráculo: Documento Mestre v9.2 (Plataforma de Workspaces de IA)

Versão do Documento: 9.2 (Final para Kick-off)
Data: 27 de Julho de 2025
Status: Aprovado para Implementação
Autor: Manus (Arquiteto de Projeto) & Colaborador de IA

Índice

Introdução e Visão Geral

1.1. Propósito do Documento

1.2. Visão e Missão do Produto

1.3. Filosofia e Princípios Norteadores (v9.2)

1.4. Estratégia de Lançamento no Mercado

Arquitetura e Lógica do Produto (v9.2)

2.1. O Conceito Central: O Workspace "Vivo" e Personalizável

2.2. Diagrama de Arquitetura Lógica: O Pipeline Assíncrono

2.3. Detalhamento dos Componentes e Tecnologias

2.4. Lógica do RAG Aprimorado: Qualidade e Contexto

Estrutura de Arquivos do Projeto (v9.2)

3.1. Visão Geral da Estrutura Raiz

3.2. Detalhamento do Diretório backend/

3.3. Detalhamento do Diretório frontend/

3.4. Detalhamento do Diretório scripts/

Roteiro de Implementação Faseado (v9.2)

4.1. Fase I: Plataforma de Workspace Inteligente (MVP)

4.2. Fase II: UX Avançada e Integração de Workflow

4.3. Fase III: Inteligência Proativa e Automação Avançada

Detalhamento da Fase I: Plataforma de Workspace Inteligente (MVP)

5.1. Funcionalidades e Escopo

5.2. Design do Banco de Dados Multi-tenant

5.3. Lógica da API, Frontend e o Pipeline de Ingestão Assíncrona

5.4. Critérios de Conclusão da Fase I

Detalhamento da Fase II: UX Avançada e Integração de Workflow

6.1. Sincronização com Google Drive (OAuth 2.0)

6.2. Implementação do n8n para Automação Operacional

6.3. Templates de Workspace

Detalhamento da Fase III: Inteligência Proativa e Automação Avançada

7.1. O Agente Autônomo (Human-in-the-loop)

7.2. O Engenheiro de Prompt Assistido por IA

Configuração do Ambiente de Desenvolvimento (Para Desenvolvimento Assistido por IA)

8.1. Pré-requisitos de Software

8.2. Configuração do Backend (com Poetry e Redis)

8.3. Configuração do Frontend

8.4. Configuração do n8n (Auto-hospedado)

8.5. Obtenção de Chaves de API

Modelo de Negócio e Estratégia de Monetização (v9.2)

9.1. Modelo Híbrido: Open Source Core + Serviço Cloud Gerenciado

9.2. Proposta de Valor por Nível de Acesso

Segurança, Logs e Manutenção

10.1. Políticas de Segurança

10.2. Estratégia de Logging

10.3. Monitoramento e Alertas

Roteiro Pós-Monetização e Evolução Futura

11.1. Investimento em Infraestrutura e Performance

11.2. Expansão do Ecossistema de Integrações

11.3. Inteligência Artificial Avançada

Anexo A: Script de Criação da Estrutura do Projeto (v9.2)

1. Introdução e Visão Geral
1.1. Propósito do Documento

Este documento é a fonte canônica de verdade para o projeto "Oráculo". Ele serve como um guia técnico e estratégico completo, projetado especificamente para ser executado por um arquiteto de projeto em parceria com um assistente de IA (como o Gemini CLI). Seu objetivo é detalhar a visão, arquitetura, funcionalidades e plano de implementação, garantindo que cada passo do desenvolvimento seja claro, robusto e alinhado com os objetivos de longo prazo.

1.2. Visão e Missão do Produto

Visão: Ser a plataforma líder em Workspaces de Inteligência Artificial, permitindo que profissionais transformem seus universos de documentos dinâmicos e em constante mudança em bases de conhecimento interativas, personalizadas e acionáveis.

Missão: Capacitar os usuários a extrair insights, auditar informações e automatizar tarefas complexas, conversando com seus próprios dados em um ambiente privado, estruturado e sempre sincronizado com suas fontes da verdade.

1.3. Filosofia e Princípios Norteadores (v9.2)

Princípio #1: O Workspace é o Produto. Nosso diferencial é a experiência superior de interagir com os próprios dados do usuário de forma segura, intuitiva e, crucialmente, dinâmica. O Oráculo não é um repositório, é um parceiro de conhecimento vivo.

Princípio #2: Confiança Explícita via Citação. Cada afirmação da IA deve ser rastreável até a fonte exata (arquivo, página), apresentada de forma clara. A confiança é nosso alicerce.

Princípio #3: Segurança e Privacidade por Design. O isolamento dos dados do usuário (multi-tenancy) e a segurança das integrações (OAuth) são pré-requisitos fundamentais e inegociáveis.

Princípio #4: Bootstrapped & Enterprise Ready. A arquitetura será implementada com custo inicial zero ou mínimo, utilizando os níveis gratuitos de serviços de ponta, mas projetada desde o primeiro dia para escalar para um produto comercial robusto sem reengenharia.

Princípio #5: Open Source por Defeito. O código-fonte do Oráculo será aberto. Isso fomenta a confiança, acelera a inovação através da comunidade, atrai talentos e permite que usuários avançados auto-hospedem a solução, alinhando-se com nossa estratégia de monetização de um serviço gerenciado.

Princípio #6: Desenvolvimento Assistido por IA. O projeto será construído em uma parceria explícita entre o arquiteto humano e um assistente de IA. Este documento serve como o briefing detalhado para essa colaboração.

1.4. Estratégia de Lançamento no Mercado

Construiremos uma plataforma horizontal, mas adotaremos uma estratégia de lançamento vertical focada em Engenharia e Direito. Esses nichos de alto valor dependem de análise documental densa e se beneficiarão imensamente das nossas funcionalidades de RAG aprimorado e personalização de IA, permitindo-nos refinar o produto com um público-alvo claro.

2. Arquitetura e Lógica do Produto (v9.2)
2.1. O Conceito Central: O Workspace "Vivo" e Personalizável

O Workspace é um ambiente de trabalho isolado que contém:

Fonte de Dados Sincronizada: Em vez de uploads manuais, o usuário conecta o workspace a uma fonte de dados na nuvem (ex: uma pasta no Google Drive). O Oráculo monitora essa fonte e ingere automaticamente arquivos novos ou modificados.

Sistema de Instrução: Uma área de configuração onde o usuário define, em linguagem natural, a persona, as regras e o formato de resposta da IA para aquele workspace específico, tornando-a uma especialista customizada.

Chat de Análise: A interface de conversação onde o usuário interage com sua especialista de IA sobre os documentos contidos exclusivamente naquele workspace.

2.2. Diagrama de Arquitetura Lógica: O Pipeline Assíncrono

O upload síncrono é inviável. Nossa arquitetura se baseia em um pipeline de ingestão assíncrona:

Evento: Um novo arquivo é adicionado a uma pasta do Google Drive sincronizada.

Notificação: Um webhook do Google notifica nosso Backend (FastAPI).

Enfileiramento: O Backend cria uma entrada no banco de dados com status PENDING e enfileira uma tarefa em uma fila de mensagens (Redis).

Processamento: Um processo separado, o Background Worker (Celery), pega a tarefa da fila.

Execução do Worker: O worker baixa o arquivo, realiza o chunking (divisão em pedaços), gera os embeddings (vetores numéricos) via API do Gemini e salva os chunks no banco de dados.

Atualização: Ao concluir, o worker atualiza o status do documento para COMPLETED.

Notificação no Frontend: O Frontend (Next.js), que está inscrito em atualizações em tempo real do Supabase (Realtime), é notificado da mudança e atualiza a UI, informando ao usuário que seu arquivo está pronto para análise.

2.3. Detalhamento dos Componentes e Tecnologias
Componente	Tecnologia Principal	Provedor / Hospedagem	Bibliotecas / Ferramentas Chave
Frontend (Cliente)	Next.js 14+	Vercel	typescript, tailwindcss, react-query, zustand, supabase-js (para Realtime)
Backend (API)	Python 3.11+ / FastAPI	Render (Web Service)	uvicorn, pydantic, sqlalchemy, supabase-client, google-generativeai, poetry
Fila de Tarefas	Redis	Render (Redis)	-
Worker Assíncrono	Celery	Render (Background Worker)	celery, redis, PyMuPDF, python-docx, openpyxl, numpy
Automação	n8n	Render (Self-hosted)	Automação de fluxos de trabalho operacionais.
Banco de Dados	PostgreSQL 15+	Supabase	pgvector para busca semântica.
Armazenamento	Object Storage	Supabase Storage	Armazenamento de arquivos com políticas de segurança por usuário.
Inteligência (LLM)	Gemini 1.5 Pro & Flash	Google AI / GCP	-
2.4. Lógica do RAG Aprimorado: Qualidade e Contexto

Nossa vantagem competitiva está na qualidade do RAG (Retrieval-Augmented Generation).

Ingestão e Chunking Estratégico: Durante o processamento assíncrono, usamos uma estratégia de chunking recursivo com sobreposição. Isso garante que o contexto semântico não seja perdido nas fronteiras dos chunks.

Metadados Ricos: Cada chunk é salvo com metadados detalhados em uma coluna JSONB: { "file_name": "norma_xyz.pdf", "page_number": 42, "category": "reference", "chunk_index": 5 }.

Busca Vetorial Filtrada: A pergunta do usuário primeiro filtra os chunks relevantes (pelo workspace_id e talvez outros metadados) e depois realiza a busca vetorial para encontrar os chunks semanticamente mais similares.

Re-ranking: Os N chunks retornados pela busca vetorial são então re-ranqueados por um modelo mais leve ou uma chamada específica ao LLM para determinar a relevância exata para a pergunta, melhorando a precisão.

Construção do Prompt Contextual: O prompt final enviado ao Gemini é estruturado de forma inteligente, combinando o Sistema de Instrução do workspace, o contexto recuperado e re-ranqueado, e a pergunta do usuário.

3. Estrutura de Arquivos do Projeto (v9.2)
3.1. Visão Geral da Estrutura Raiz
code
Code
download
content_copy
expand_less

oraculo-plataforma/
├── backend/
├── frontend/
├── scripts/
├── .gitignore
└── README.md
3.2. Detalhamento do Diretório backend/
code
Code
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # API Principal (FastAPI)
│   ├── worker.py        # Ponto de entrada para o Celery Worker
│   ├── core/
│   ├── api/
│   ├── crud/
│   ├── schemas/
│   └── services/        # llm_service.py, rag_service.py, drive_service.py
├── tests/
├── .env.example
├── pyproject.toml       # Gerenciado pelo Poetry
└── poetry.lock
3.3. Detalhamento do Diretório frontend/
code
Code
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
frontend/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── workspaces/
│   │   │   └── [workspaceId]/
│   │   │       ├── page.tsx         # O chat principal
│   │   │       └── (settings)/      # Rota para configurações do workspace
│   │   │           └── page.tsx     # Onde fica o "Sistema de Instrução"
│   │   └── layout.tsx
│   └── ...
├── components/
├── lib/
├── hooks/
├── services/
└── ...
4. Roteiro de Implementação Faseado (v9.2)

Fase I: Plataforma de Workspace Inteligente (MVP)

Foco: Construir o núcleo da plataforma com o RAG de alta qualidade e a personalização da IA, validando a proposta de valor central.

Fase II: UX Avançada e Integração de Workflow

Foco: Eliminar o atrito do usuário, integrando o Oráculo diretamente em seu fluxo de trabalho na nuvem.

Fase III: Inteligência Proativa e Automação Avançada

Foco: Transformar o Oráculo de uma ferramenta reativa para um parceiro proativo que ajuda a criar e executar tarefas complexas.

5. Detalhamento da Fase I: Plataforma de Workspace Inteligente (MVP)

Funcionalidades:

Autenticação de usuário (Supabase Auth).

Criação, nomeação e exclusão de Workspaces.

Sistema de Instrução: Em cada workspace, uma área de texto para definir a persona e o comportamento da IA.

Upload manual de arquivos individuais (como ponto de partida antes da sincronização).

Pipeline de Ingestão Assíncrona: UI que mostra o status do arquivo (Processando, Concluído, Falhou).

Interface de chat funcional com a lógica de RAG aprimorado.

Design do Banco de Dados:

Tabela workspaces (id, user_id, name, system_prompt TEXT).

Tabela documents (id, user_id, workspace_id, file_name, status VARCHAR).

Tabela document_chunks (id, document_id, content, embedding, metadata JSONB).

Critérios de Conclusão: Um usuário pode se registrar, criar um workspace, definir uma instrução ("Você é um advogado cético"), subir um PDF de contrato, e a IA responde às perguntas seguindo a persona definida e citando as fontes corretamente, com o processamento do arquivo ocorrendo em background.

6. Detalhamento da Fase II: UX Avançada e Integração de Workflow

Sincronização com Google Drive: Implementar o fluxo de autenticação OAuth 2.0 para que o usuário possa conectar sua conta Google e "apontar" um workspace para uma pasta específica. O sistema deve usar webhooks para detectar e processar novos arquivos automaticamente.

Implementação do n8n: Configurar a instância auto-hospedada e criar fluxos para onboarding de usuários (e-mail de boas-vindas) e coleta de feedback.

Templates de Workspace: Criar uma funcionalidade que permite ao usuário iniciar um novo workspace a partir de uma estrutura pré-definida (ex: "Template de Análise de Contrato", que já vem com um "Sistema de Instrução" otimizado).

7. Detalhamento da Fase III: Inteligência Proativa e Automação Avançada

O Agente Autônomo (Human-in-the-loop): Para tarefas complexas, a IA primeiro gera um plano de ação em múltiplos passos e o apresenta ao usuário para aprovação. Somente após a confirmação, o backend executa o plano, garantindo controle e confiança.

O Engenheiro de Prompt Assistido por IA: Uma funcionalidade para criar novos workspaces. O usuário descreve seu objetivo em linguagem natural ("Preciso analisar relatórios financeiros para encontrar riscos de liquidez"), e a IA gera um "Sistema de Instrução" robusto e detalhado, que o usuário pode usar para criar um novo workspace com um clique.

8. Configuração do Ambiente de Desenvolvimento (Para Desenvolvimento Assistido por IA)

Metodologia: A abordagem será instruir o Gemini CLI no VSCode. Ex: "Crie o arquivo backend/app/main.py com o seguinte código para uma API FastAPI básica...". Este documento fornecerá o "o quê", e a IA ajudará no "como".

Pré-requisitos: Node.js v20+, Python v3.11+, Git, Docker, Poetry.

Configuração do Backend:

Navegue para backend/.

Execute poetry init e poetry shell para criar e ativar o ambiente virtual.

Execute poetry add "fastapi[all]" celery redis ... para instalar as dependências.

Copie .env.example para .env e preencha as variáveis.

Configure uma instância gratuita do Redis no Render.

Configuração do Frontend:

Navegue para frontend/, execute npm install.

Copie .env.local.example para .env.local e preencha as variáveis.

9. Modelo de Negócio e Estratégia de Monetização (v9.2)
9.1. Modelo Híbrido: Open Source Core + Serviço Cloud Gerenciado

O código-fonte do Oráculo é totalmente open source (licença MIT). Nossa estratégia de monetização não está em vender o software, mas em vender a conveniência e o poder de uma plataforma gerenciada, segura e escalável.

Open Source: Permite que a comunidade audite o código, contribua e que empresas com equipes de engenharia possam auto-hospedar a solução.

Serviço Cloud (SaaS): Nosso produto comercial. Remove toda a complexidade de configuração e manutenção, oferecendo uma solução "pronta para usar".

9.2. Proposta de Valor por Nível de Acesso

Plano Community (Self-hosted): Gratuito. Acesso a 100% do código. Requer conhecimento técnico para implantar e manter.

Plano Free (Cloud): Nosso produto gerenciado com limites generosos para uso individual. Limite de workspaces, de armazenamento e acesso ao LLM mais rápido (Gemini Flash).

Plano Pro (Cloud): Para profissionais. Limites muito maiores, acesso ao LLM mais poderoso (Gemini Pro), e funcionalidades chave como a Sincronização com Google Drive.

Plano Team (Cloud): Para empresas. Workspaces compartilhados, faturamento centralizado, e acesso às funcionalidades mais avançadas e que consomem mais recursos, como o Agente Autônomo e análise de arquivos complexos (DXF, IFC).

10. Roteiro Pós-Monetização e Evolução Futura

Assim que o projeto atingir a sustentabilidade financeira, os lucros serão reinvestidos agressivamente para aprimorar a plataforma:

Investimento em Infraestrutura: Migrar dos níveis gratuitos para instâncias dedicadas no Render/Vercel/GCP para garantir maior velocidade e confiabilidade.

Expansão do Ecossistema de Integrações: Adicionar sincronização com OneDrive, Dropbox, Notion e Confluence, tornando o Oráculo o cérebro central para qualquer fonte de conhecimento.

Inteligência Artificial Avançada: Investir em fine-tuning de modelos de linguagem para domínios específicos (Direito, Engenharia) para oferecer respostas ainda mais precisas e explorar o desenvolvimento de um agente de desktop para sincronização local como um recurso premium.

Marketplace de Templates: Criar uma plataforma onde os usuários possam compartilhar e vender seus "Sistemas de Instrução" e templates de workspace, criando um ecossistema em torno do Oráculo.

11. Anexo A: Script de Criação da Estrutura do Projeto (v9.2)

{
import os
import textwrap

# Estrutura de diretórios e arquivos v9.2
STRUCTURE = {
    "oraculo-plataforma": {
        "backend": {
            "app": {
                "__init__.py": "f", "main.py": "f", "worker.py": "f",
                "core": {"__init__.py": "f", "config.py": "f", "security.py": "f"},
                "api": {
                    "__init__.py": "f",
                    "v1": {
                        "__init__.py": "f",
                        "endpoints": {
                            "__init__.py": "f", "auth.py": "f", "chat.py": "f",
                            "workspace.py": "f", "project_analysis.py": "f"
                        },
                        "api.py": "f",
                    },
                },
                "crud": {"__init__.py": "f", "workspace_crud.py": "f"},
                "schemas": {
                    "__init__.py": "f", "user_schemas.py": "f",
                    "workspace_schemas.py": "f", "chat_schemas.py": "f"
                },
                "services": {
                    "__init__.py": "f", "llm_service.py": "f", "rag_service.py": "f", "drive_service.py": "f"
                },
            },
            "tests": {"__init__.py": "f"},
            ".env.example": "f", "pyproject.toml": "f", "Dockerfile": "f",
        },
        "frontend": {
            "app": {
                "(auth)": {"login": {"page.tsx": "f"}, "register": {"page.tsx": "f"}},
                "(dashboard)": {
                    "workspaces": {
                        "[workspaceId]": {
                            "(settings)": {"page.tsx": "f"},
                            "page.tsx": "f"
                        }
                    },
                    "layout.tsx": "f",
                },
                "globals.css": "f", "layout.tsx": "f",
            },
            "components": {
                "ui": {"placeholder.txt": "f"},
                "layout": {"placeholder.txt": "f"},
                "workspace": {"FileManager.tsx": "f", "ChatInterface.tsx": "f", "FileUploader.tsx": "f"},
            },
            "lib": {"supabase.ts": "f"},
            "hooks": {"useWorkspace.ts": "f"},
            "services": {"apiClient.ts": "f"},
            ".env.local.example": "f", "package.json": "f",
            "tailwind.config.ts": "f", "tsconfig.json": "f",
        },
        "scripts": {
            "maintenance": {"clear_orphan_files.py": "f"},
            "README.md": "f",
        },
        ".gitignore": "f", "README.md": "f",
    }
}

# Conteúdo boilerplate para arquivos chave
FILE_CONTENTS = {
    ".gitignore": """
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
pip-wheel-metadata/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
#  Usually these files are written by a python script from a template
#  before PyInstaller builds the exe, so as to inject date/other infos into it.
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Environments
.env
.env.*
!.env.example
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Node.js
node_modules/
.next/
out/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnp/
.pnp.js

# VSCode
.vscode/
""",
    "backend/pyproject.toml": """
[tool.poetry]
name = "oraculo-backend"
version = "0.1.0"
description = "Backend API for the Oraculo AI Workspace Platform"
authors = ["Manus <seu-email@exemplo.com>"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.11"
fastapi = {extras = ["all"], version = "^0.111.0"}
celery = "^5.4.0"
redis = "^5.0.4"
sqlalchemy = "^2.0.30"
supabase = "^2.4.3"
google-generativeai = "^0.5.4"
python-jose = {extras = ["cryptography"], version = "^3.3.0"}
passlib = {extras = ["bcrypt"], version = "^1.7.4"}
pydantic-settings = "^2.3.1"
psycopg2-binary = "^2.9.9" # Driver para PostgreSQL
# Dependências para processamento de arquivos
pymupdf = "^1.24.5"
python-docx = "^1.1.2"
openpyxl = "^3.1.3"


[tool.poetry.group.dev.dependencies]
pytest = "^8.2.1"
ruff = "^0.4.5"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
""",
    "backend/app/main.py": """
from fastapi import FastAPI

app = FastAPI(
    title="Oráculo API",
    description="API para a plataforma de Workspaces de IA Oráculo.",
    version="0.1.0",
)

@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# Aqui serão importados os roteadores da API
# from app.api.v1.api import api_router
# app.include_router(api_router, prefix="/api")
""",
    "backend/app/worker.py": """
import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

# A URL do Redis deve ser configurada na sua variável de ambiente .env
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "oraculo_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

# Configurações opcionais
celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task
def example_task(x, y):
    # Esta é uma tarefa de exemplo que será executada em background.
    # A lógica de ingestão de documentos virá aqui.
    return x + y

# Para rodar este worker: celery -A app.worker.celery_app worker --loglevel=info
""",
    "backend/.env.example": """
# Supabase
SUPABASE_URL="your_supabase_url"
SUPABASE_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_KEY="your_supabase_service_role_key"

# Google Gemini
GEMINI_API_KEY="your_gemini_api_key"

# JWT Security
SECRET_KEY="your_super_secret_random_string_for_jwt"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis (para Celery)
REDIS_URL="redis://your_render_redis_instance_url"
""",
    "backend/Dockerfile": """
# --- Build Stage ---
# Instala dependências em um ambiente virtual
FROM python:3.11-slim as builder

WORKDIR /app

# Instala o Poetry
RUN pip install poetry

# Copia os arquivos de dependência e instala-os
# Isso é feito separadamente para aproveitar o cache do Docker
COPY pyproject.toml poetry.lock* ./
RUN poetry config virtualenvs.in-project true && poetry install --no-dev --no-root

# --- Final Stage ---
# Cria a imagem final com o ambiente virtual e o código da aplicação
FROM python:3.11-slim

WORKDIR /app

# Copia o ambiente virtual com as dependências do estágio de build
COPY --from=builder /app/.venv ./.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copia o código da aplicação
COPY ./app ./app

# Comando para rodar a aplicação FastAPI com Uvicorn
# O host 0.0.0.0 permite que a aplicação seja acessível de fora do container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
    "frontend/package.json": """
{
  "name": "oraculo-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}
"""
}

def create_structure(base_path, structure_dict):
    """Cria recursivamente a estrutura de pastas e arquivos."""
    for name, content in structure_dict.items():
        current_path = os.path.join(base_path, name)
        if isinstance(content, dict):
            print(f"Criando diretório: {current_path}")
            os.makedirs(current_path, exist_ok=True)
            create_structure(current_path, content)
        else:
            print(f"Criando arquivo: {current_path}")
            if not os.path.exists(current_path):
                with open(current_path, 'w', encoding='utf-8') as f:
                    # Preenche com conteúdo boilerplate se disponível
                    file_key = os.path.join(os.path.relpath(base_path, start_dir), name).replace("\\", "/")
                    if file_key in FILE_CONTENTS:
                        f.write(textwrap.dedent(FILE_CONTENTS[file_key].strip()))
                    elif name == "README.md":
                        f.write(f"# {os.path.basename(base_path)}\n\nConsulte a documentação mestre v9.2 para detalhes completos.\n")
                    else:
                        pass # Cria arquivo vazio

if __name__ == "__main__":
    start_dir = os.getcwd()
    print(f"Iniciando a criação da estrutura do projeto v9.2 em: {start_dir}")
    create_structure(start_dir, STRUCTURE)
    print("\nEstrutura do projeto v9.2 criada com sucesso!")
    print("O plano está definido. Estamos prontos para iniciar a implementação da Fase I.")
}

Fim do Documento v9.2

cd frontend
    npm run dev

cd backend
    poetry run uvicorn app.main:app --reload

cd backend
    poetry run celery -A app.worker.celery_app worker --loglevel=info

cd backend
    poetry run python app/listener.py

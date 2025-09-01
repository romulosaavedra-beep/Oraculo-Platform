# Contexto do Backend do Oráculo (GEMINI.md - Backend)

Este diretório contém todo o código do lado do servidor para o Projeto Oráculo. Lembre-se das regras e personas definidas no `GEMINI.md` da raiz.

## Contexto Específico do Backend

O backend é responsável por:
1.  Fornecer uma API RESTful (FastAPI) para o frontend.
2.  Gerenciar a autenticação e autorização de usuários.
3.  Orquestrar o pipeline de ingestão assíncrona de documentos.
4.  Interagir com o Supabase (banco de dados e storage).
5.  Executar a lógica de RAG e se comunicar com a API do Gemini.

## Stack Tecnológica Específica do Backend

- **Framework:** FastAPI
- **Gerenciador de Pacotes:** Poetry. Sempre use `poetry add <pacote>` para adicionar dependências.
- **Validação de Dados:** Pydantic. **Todo** dado que entra ou sai da API deve ser validado por um schema Pydantic.
- **Tarefas Assíncronas:** Celery com Redis como broker.
- **ORM/DB Client:** SQLAlchemy para a lógica principal e `supabase-client` para interações diretas.

## Padrões de Código e Boas Práticas (Backend)

1.  **Tipagem Estrita:** Use type hints do Python em todas as funções e variáveis. A clareza é fundamental.
2.  **Injeção de Dependência:** Use o sistema de `Depends` do FastAPI extensivamente para gerenciar dependências como sessões de banco de dados e autenticação de usuários.
3.  **Estrutura de Módulos:** Siga rigorosamente a estrutura de arquivos definida no Documento Mestre v9.2 (`/api`, `/crud`, `/schemas`, `/services`).
4.  **Variáveis de Ambiente:** Use a classe `Settings` do Pydantic para carregar e validar todas as variáveis de ambiente a partir de um arquivo `.env`.
5.  **Testes:** Use `pytest`. Para cada endpoint criado, devemos criar um teste de integração correspondente.

## Exemplo de Prompt para o Backend

"Gemini, vamos criar o endpoint para que um usuário possa criar um novo workspace. Conforme o Documento Mestre, ele deve receber um nome para o workspace e associá-lo ao `user_id` do token JWT. Por favor, crie o schema Pydantic, a função CRUD e a rota na API em `api/v1/endpoints/workspace.py`."
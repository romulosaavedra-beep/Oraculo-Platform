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
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "10000"]
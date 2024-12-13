.PHONY: install dev build migrate-dev migrate-deploy db-push db-reset redis-start lint format

install:
	npm install

dev:
	npm run dev

build:
	npm run build

migrate-dev:
	npx prisma migrate dev

migrate-deploy:
	npx prisma migrate deploy

db-push:
	npx prisma db push

db-reset:
	npx prisma migrate reset

redis-start:
	redis-server

lint:
	npm run lint

format:
	npm run format

setup: install migrate-dev

help:
	@echo "Comandos disponíveis:"
	@echo "  make install         - Instala todas as dependências"
	@echo "  make dev            - Inicia o servidor de desenvolvimento"
	@echo "  make build          - Gera build de produção"
	@echo "  make migrate-dev    - Executa migrações do Prisma em desenvolvimento"
	@echo "  make migrate-deploy - Executa migrações do Prisma em produção"
	@echo "  make db-push       - Atualiza o banco de dados sem criar migrações"
	@echo "  make db-reset      - Reseta o banco de dados"
	@echo "  make redis-start   - Inicia o servidor Redis"
	@echo "  make lint          - Executa o linter"
	@echo "  make format        - Formata o código"
	@echo "  make setup         - Instala dependências e configura o banco"
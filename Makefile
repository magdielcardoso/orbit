# Variáveis
NODE = node
NPM = npm
PRISMA = npx prisma

# Comandos principais
.PHONY: install dev build start clean migrate reinstall

install:
	$(NPM) install
	cd backend && $(NPM) install

dev:
	$(NPM) run dev

dev-backend:
	cd backend && $(NPM) run dev

dev-frontend:
	$(NPM) run dev:frontend

build:
	$(NPM) run build

start:
	$(NPM) run preview

clean:
	rm -rf node_modules
	rm -rf dist
	cd backend && rm -rf node_modules

# Comandos do Prisma
.PHONY: migrate-dev migrate-deploy studio generate

migrate-dev:
	cd backend && DATABASE_URL="postgresql://orbitchat:orbitchat@localhost:5432/orbitchat?schema=public" npx prisma migrate dev

migrate-deploy:
	cd backend && DATABASE_URL="postgresql://orbitchat:orbitchat@localhost:5432/orbitchat?schema=public" npm run prisma:migrate

studio:
	cd backend && DATABASE_URL="postgresql://orbitchat:orbitchat@localhost:5432/orbitchat?schema=public" npm run prisma:studio

generate:
	cd backend && DATABASE_URL="postgresql://orbitchat:orbitchat@localhost:5432/orbitchat?schema=public" npm run prisma:generate

# Comandos compostos
.PHONY: setup reset reinstall

setup: install migrate-dev generate

reset: clean setup

reinstall:
	rm -rf node_modules
	rm -rf backend/node_modules
	rm -rf backend/package-lock.json
	rm -rf package-lock.json
	$(NPM) install
	cd backend && $(NPM) install

seed:
	cd backend && npx prisma db seed

setup-db:
	cd backend && npx prisma generate && npx prisma migrate reset --force && npx prisma db seed

# Comandos de banco de dados
.PHONY: db-reset db-seed db-setup

db-reset:
	cd backend && DATABASE_URL="postgresql://orbitchat:orbitchat@localhost:5432/orbitchat?schema=public" npx prisma migrate reset --force

db-seed:
	cd backend && DATABASE_URL="postgresql://orbitchat:orbitchat@localhost:5432/orbitchat?schema=public" npx prisma db seed

db-setup: generate db-reset db-seed

# Comandos Docker
.PHONY: docker docker-push docker-compose-up docker-compose-down docker-compose-logs

docker:
	docker build -t stacklabdigital/orbitchat:develop .

docker-push:
	docker push stacklabdigital/orbitchat:develop

docker-compose-up:
	docker-compose up -d

docker-compose-down:
	docker-compose down

docker-compose-logs:
	docker-compose logs -f

docker-compose-build:
	docker-compose build

docker-compose-setup: docker-compose-build docker-compose-up

# Comando composto para build e push
docker-publish: docker-build docker-push
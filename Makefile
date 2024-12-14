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
	cd backend && npm run prisma:migrate

migrate-deploy:
	cd backend && npm run prisma:migrate

studio:
	cd backend && npm run prisma:studio

generate:
	cd backend && npm run prisma:generate

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
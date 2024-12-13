# Variáveis
NODE = node
NPM = npm
PRISMA = npx prisma

# Comandos principais
.PHONY: install dev build start clean migrate

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

start:
	$(NPM) run preview

clean:
	rm -rf node_modules
	rm -rf dist

# Comandos do Prisma
.PHONY: migrate-dev migrate-deploy studio generate

migrate-dev:
	$(PRISMA) migrate dev

migrate-deploy:
	$(PRISMA) migrate deploy

studio:
	$(PRISMA) studio

generate:
	$(PRISMA) generate

# Comandos compostos
.PHONY: setup reset

setup: install migrate-dev generate

reset: clean setup
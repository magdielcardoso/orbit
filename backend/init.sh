#!/bin/sh

echo "Iniciando setup do banco de dados..."

# Aguarda o PostgreSQL estar pronto
until nc -z postgres 5432; do
  echo "Aguardando PostgreSQL..."
  sleep 1
done

# Gera o Prisma Client
echo "Gerando Prisma Client..."
npx prisma generate

# Aplica migrações pendentes
echo "Aplicando migrações pendentes..."
npx prisma migrate deploy

# Verifica se existem roles e executa seed se necessário
echo "Verificando roles..."
npx prisma db seed

# Inicia a aplicação
echo "Iniciando aplicação..."
npm run start 
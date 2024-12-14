#!/bin/sh

echo "Iniciando setup do banco de dados..."

# Gera o Prisma Client
echo "Gerando Prisma Client..."
DATABASE_URL="postgresql://postgres:PT99874166@postgres:5432/orbitchat?schema=public" npx prisma generate

# Aplica migrações pendentes sem resetar dados
echo "Aplicando migrações pendentes..."
DATABASE_URL="postgresql://postgres:PT99874166@postgres:5432/orbitchat?schema=public" npx prisma migrate deploy

# Verifica se existem roles no banco
echo "Verificando roles..."
ROLES_COUNT=$(DATABASE_URL="postgresql://postgres:PT99874166@postgres:5432/orbitchat?schema=public" npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM role;")

# Executa o seed se não houver roles
if [ "$ROLES_COUNT" = "0" ]; then
    echo "Roles não encontradas, executando seed para configurar permissões básicas..."
    DATABASE_URL="postgresql://postgres:PT99874166@postgres:5432/orbitchat?schema=public" npx prisma db seed
else
    echo "Roles já configuradas, verificando integridade..."
    # Verifica se todas as roles necessárias existem
    REQUIRED_ROLES=$(DATABASE_URL="postgresql://postgres:PT99874166@postgres:5432/orbitchat?schema=public" npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM role WHERE name IN ('superadmin', 'user', 'agent');")
    
    if [ "$REQUIRED_ROLES" != "3" ]; then
        echo "Algumas roles necessárias estão faltando, executando seed..."
        DATABASE_URL="postgresql://postgres:PT99874166@postgres:5432/orbitchat?schema=public" npx prisma db seed
    else
        echo "Todas as roles necessárias estão presentes."
    fi
fi

# Inicia a aplicação
echo "Iniciando aplicação..."
npm run dev 
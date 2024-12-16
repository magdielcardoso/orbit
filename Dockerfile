# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências necessárias e pnpm globalmente
RUN apk add --no-cache libc6-compat openssl openssl-dev netcat-openbsd
RUN npm install -g pnpm

# Copia os arquivos de configuração
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY backend/package*.json ./backend/

# Instala todas as dependências (incluindo devDependencies)
RUN pnpm install --frozen-lockfile
RUN cd backend && pnpm install --no-frozen-lockfile
RUN pnpm add -D terser

# Copia o código fonte
COPY . .

# Gera o Prisma Client e build da aplicação
RUN cd backend && npx prisma generate
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instala dependências necessárias e pnpm globalmente
RUN apk add --no-cache libc6-compat openssl openssl-dev netcat-openbsd
RUN npm install -g pnpm

# Copia os arquivos necessários do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Torna o script executável
RUN chmod +x /app/backend/init.sh

# Expõe as portas necessárias
EXPOSE 5173 4000

# Define as variáveis de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação em produção
CMD ["pnpm", "run", "preview"]
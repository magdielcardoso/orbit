import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Carrega as variáveis de ambiente do arquivo .env
config()

// Determina se estamos em produção ou desenvolvimento
const isProduction = process.env.NODE_ENV === 'production'
const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost'
const DB_USERNAME = process.env.DB_USERNAME ? process.env.DB_USERNAME : 'postgres'
const DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '123456'
const DB_PORT = process.env.DB_PORT ? process.env.DB_PORT : '5432'
const DB_SCHEMA = process.env.DB_SCHEMA ? process.env.DB_SCHEMA : 'public'

// Configura a URL do banco de dados com base no ambiente
const databaseUrl = isProduction
  ? `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/orbitchat?schema=${DB_SCHEMA}`
  : `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/orbitchat_dev?schema=${DB_SCHEMA}`

// Cria a instância única do Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

export default prisma

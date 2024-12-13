import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const fastify = Fastify({ logger: true })

// Registra plugins
fastify.register(cors, {
  origin: true,
  credentials: true
})

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
})

// Rotas de autenticação
fastify.post('/api/auth/register', async (request, reply) => {
  const { email, password, name } = request.body

  try {
    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return reply.status(400).send({ message: 'Email já está em uso' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    // Gera o token
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ message: 'Erro ao criar conta' })
  }
})

fastify.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body

  try {
    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return reply.status(401).send({ message: 'Email ou senha inválidos' })
    }

    // Verifica a senha
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return reply.status(401).send({ message: 'Email ou senha inválidos' })
    }

    // Gera o token
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name,
      permissions: user.role?.permissions.map(p => p.permission.name) || []
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name,
        permissions: user.role?.permissions.map(p => p.permission.name) || []
      }
    }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ message: 'Erro ao fazer login' })
  }
})

// Inicia o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start() 
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

// Middleware de autenticação
const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
}

// Middleware de verificação de superadmin
const requireSuperAdmin = async (request, reply) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
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

    const hasPermission = user.role?.permissions.some(
      p => p.permission.name === 'manage_system'
    )

    if (!hasPermission) {
      reply.status(403).send({ message: 'Acesso negado' })
    }
  } catch (err) {
    reply.send(err)
  }
}

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

    // Busca a role padrão (user)
    const defaultRole = await prisma.role.findUnique({
      where: { name: 'user' }
    })

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: defaultRole.id // Atribui a role padrão
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

// Rota de status do sistema
fastify.get('/api/system/status', async (request, reply) => {
  try {
    const config = await prisma.systemConfig.findFirst()
    return { status: config?.status || 'PENDING_SETUP' }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ message: 'Erro ao verificar status do sistema' })
  }
})

// Rota de setup inicial do sistema
fastify.post('/api/system/setup', async (request, reply) => {
  const { name, email, password, systemName, timezone } = request.body;

  try {
    // Verifica se o sistema já foi configurado
    let config = await prisma.systemConfig.findFirst();
    
    if (config?.status === 'CONFIGURED') {
      return reply.status(400).send({ message: 'Sistema já configurado' });
    }

    // Se não existir config, cria um novo
    if (!config) {
      config = await prisma.systemConfig.create({
        data: {
          status: 'PENDING_SETUP'
        }
      });
    }

    // Busca a role de superadmin
    const superadminRole = await prisma.role.findUnique({
      where: { name: 'superadmin' }
    });

    if (!superadminRole) {
      return reply.status(500).send({ message: 'Role superadmin não encontrada' });
    }

    // Verifica se já existe um usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Se estiver em setup e o usuário existir, vamos limpar e recriar
      if (config.status === 'PENDING_SETUP') {
        // Limpa todos os usuários existentes
        await prisma.user.deleteMany();
      } else {
        return reply.status(400).send({ message: 'Email já está em uso' });
      }
    }

    // Cria o primeiro usuário (superadmin)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: superadminRole.id
      }
    });

    // Atualiza o status do sistema
    await prisma.systemConfig.update({
      where: { id: config.id },
      data: {
        status: 'CONFIGURED',
        setupCompletedAt: new Date()
      }
    });

    // Gera o token para o superadmin
    const token = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'superadmin',
      permissions: ['manage_system', 'manage_users', 'manage_roles', 'view_admin_panel']
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'superadmin'
      }
    };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: 'Erro ao configurar o sistema' });
  }
});

// Rotas de administração (protegidas)
fastify.register(async function (fastify) {
  fastify.addHook('preHandler', authenticate)
  fastify.addHook('preHandler', requireSuperAdmin)

  // Estatísticas do sistema
  fastify.get('/api/admin/stats', async (request, reply) => {
    try {
      const [totalUsers, totalRoles] = await Promise.all([
        prisma.user.count(),
        prisma.role.count()
      ])

      return { totalUsers, totalRoles }
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ message: 'Erro ao buscar estatísticas' })
    }
  })

  // Configurações do sistema
  fastify.get('/api/admin/system-config', async (request, reply) => {
    try {
      const config = await prisma.systemConfig.findFirst()
      return config
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ message: 'Erro ao buscar configurações' })
    }
  })

  // Atividades recentes
  fastify.get('/api/admin/activities', async (request, reply) => {
    try {
      // Aqui você implementaria a lógica para buscar as atividades recentes
      // Por enquanto, retornamos dados mockados
      return [
        {
          id: 1,
          type: 'user_created',
          description: 'Novo usuário registrado',
          user: 'João Silva',
          timestamp: new Date()
        },
        {
          id: 2,
          type: 'role_updated',
          description: 'Papel "admin" atualizado',
          user: 'Admin',
          timestamp: new Date()
        }
      ]
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ message: 'Erro ao buscar atividades' })
    }
  })
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
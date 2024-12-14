import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class AuthService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async register({ email, password, name }) {
    // Verifica se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Busca o papel padrão (user) e a permissão use_chat
    const [defaultRole, useChat] = await Promise.all([
      this.prisma.role.findUnique({
        where: { name: 'user' }
      }),
      this.prisma.permission.findUnique({
        where: { name: 'use_chat' }
      })
    ])

    if (!defaultRole) {
      throw new Error('Papel padrão não encontrado')
    }

    if (!useChat) {
      throw new Error('Permissão use_chat não encontrada')
    }

    // Cria o usuário e associa a permissão
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        active: true,
        role: {
          connect: { id: defaultRole.id }
        }
      },
      include: {
        role: true
      }
    })

    // Associa a permissão use_chat ao papel do usuário
    await this.prisma.rolePermission.create({
      data: {
        roleId: defaultRole.id,
        permissionId: useChat.id
      }
    })

    // Gera o token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role.name,
        permissions: ['use_chat']
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        active: user.active,
        role: {
          name: user.role.name,
          permissions: [{ name: 'use_chat' }]
        }
      }
    }
  }

  async login({ email, password }) {
    try {
      // Busca o usuário com todas as permissões
      const user = await this.prisma.user.findUnique({
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

      console.log('Found user:', JSON.stringify(user, null, 2)) // Debug

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      // Verifica a senha
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Senha inválida')
      }

      // Mapeia as permissões para o formato esperado
      const permissions = user.role.permissions.map(rp => ({
        name: rp.permission.name
      }))

      // Retorna o formato esperado pelo frontend
      return { 
        token: jwt.sign(
          { 
            id: user.id,
            email: user.email,
            role: user.role.name,
            permissions: permissions.map(p => p.name)
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        ),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          active: user.active,
          role: {
            name: user.role.name,
            permissions: permissions
          }
        }
      }
    } catch (error) {
      console.error('Login service error:', error)
      throw error
    }
  }
} 
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

    // Busca o papel padrão (user)
    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'user' }
    })

    if (!defaultRole) {
      throw new Error('Papel padrão não encontrado')
    }

    // Cria o usuário
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: defaultRole.id,
        active: true
      },
      include: {
        role: true
      }
    })

    // Gera o token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { user, token }
  }

  async login({ email, password }) {
    // Busca o usuário
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

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Verifica a senha
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Senha inválida')
    }

    // Verifica se o usuário está ativo
    if (!user.active) {
      throw new Error('Usuário inativo')
    }

    // Gera o token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions.map(p => p.permission.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return { user, token }
  }
} 
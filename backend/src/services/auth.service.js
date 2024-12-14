import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class AuthService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async register({ email, password, name }) {
    try {
      // Verifica se usuário já existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        throw new Error('Email já cadastrado')
      }

      // Busca ou cria o papel padrão 'user'
      let userRole = await this.prisma.role.findUnique({
        where: { name: 'user' }
      })

      if (!userRole) {
        userRole = await this.prisma.role.create({
          data: {
            name: 'user',
            description: 'Usuário padrão do sistema'
          }
        })

        // Cria permissão use_chat se não existir
        const useChat = await this.prisma.permission.upsert({
          where: { name: 'use_chat' },
          update: {},
          create: {
            name: 'use_chat',
            description: 'Usar o chat'
          }
        })

        // Associa permissão ao papel
        await this.prisma.rolePermission.create({
          data: {
            roleId: userRole.id,
            permissionId: useChat.id
          }
        })
      }

      // Cria o usuário com o papel padrão
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          roleId: userRole.id,
          active: true
        },
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
      console.error('Register service error:', error)
      throw error
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
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class AuthService {
  async register(userData) {
    const { email, password, name } = userData;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    return this.generateToken(user);
  }

  async login(credentials) {
    const { email, password } = credentials;
    
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
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Senha inválida');
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    const permissions = user.role?.permissions.map(p => p.permission.name) || [];
    
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role?.name,
        permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name,
        permissions
      }
    };
  }
}

export default new AuthService(); 
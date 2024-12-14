import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function logActivity({
  type,
  level = 'INFO',
  source,
  action,
  description,
  userId,
  metadata = {}
}) {
  try {
    return await prisma.activity.create({
      data: {
        type,
        level,
        source,
        action,
        description,
        userId,
        metadata
      }
    });
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
  }
} 
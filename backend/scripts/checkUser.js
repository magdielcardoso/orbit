import { PrismaClient } from '@prisma/client'
import '../scripts/loadEnv.js'

const prisma = new PrismaClient()

async function checkUser(email) {
  try {
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

    console.log('User details:', JSON.stringify(user, null, 2))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser('user@orbitchat.io')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Checking database tables...')
  try {
    const users = await prisma.user.count()
    console.log(`User table exists. Count: ${users}`)
    
    const transactions = await prisma.transaction.count()
    console.log(`Transaction table exists. Count: ${transactions}`)
    
    const ratings = await prisma.rating.count()
    console.log(`Rating table exists. Count: ${ratings}`)
    
    console.log('All required tables verified successfully.')
  } catch (e) {
    console.error('VERIFICATION FAILED:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()

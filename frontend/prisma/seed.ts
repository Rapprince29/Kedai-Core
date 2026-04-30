import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = ['Coffee', 'Pastry', 'Non-Coffee']
  
  console.log('Seeding categories...')
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, active: true },
    })
  }

  const categoryMap = await prisma.category.findMany()
  const getCatId = (name: string) => categoryMap.find(c => c.name === name)?.id || 1

  const menus = [
    {
      name: 'Artisan Macchiato',
      description: 'Bold espresso with a dollop of steamed milk foam.',
      price: 28000,
      categoryId: getCatId('Coffee'),
      image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=800&q=85&fit=crop',
      stock: 50,
      isBestSeller: true,
    },
    {
      name: 'Midnight Cappuccino',
      description: 'Classic Italian coffee with double espresso and hot milk.',
      price: 32000,
      categoryId: getCatId('Coffee'),
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=85&fit=crop',
      stock: 50,
      isBestSeller: true,
    },
    {
      name: 'Forest Cold Brew',
      description: 'Steeped for 18 hours in cold water, smooth and naturally sweet.',
      price: 35000,
      categoryId: getCatId('Coffee'),
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=85&fit=crop',
      stock: 50,
    },
    {
      name: 'Velvet Flat White',
      description: 'Ristretto-based espresso with a thin layer of microfoam.',
      price: 30000,
      categoryId: getCatId('Coffee'),
      image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=800&q=85&fit=crop',
      stock: 50,
    },
    {
      name: 'Artisan Croissant',
      description: 'Buttery, flaky pastry, perfect with coffee.',
      price: 22000,
      categoryId: getCatId('Pastry'),
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=85&fit=crop',
      stock: 20,
      isBestSeller: true,
    }
  ]

  console.log('Seeding menu...')
  for (const item of menus) {
    await prisma.menu.create({
      data: item,
    })
  }
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

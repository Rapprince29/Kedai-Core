import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define local interface to bypass broken @prisma/client exports
interface CategoryType {
  id: number;
  name: string;
}

async function main() {
  const categories = ['Coffee', 'Pastry', 'Non-Coffee']
  
  console.log('Seeding categories...')
  for (const name of categories) {
    await (prisma as any).category.upsert({
      where: { name },
      update: {},
      create: { name, active: true },
    })
  }

  const categoryMap: CategoryType[] = await (prisma as any).category.findMany()
  const getCatId = (name: string) => categoryMap.find((c: CategoryType) => c.name === name)?.id || 1

  const menus = [
    {
      name: 'Deep Sea Macchiato',
      description: 'Bold espresso with a dollop of steamed milk foam, inspired by the depths.',
      price: 28000,
      categoryId: getCatId('Coffee'),
      flavor: 'Pahit',
      image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=800&q=85&fit=crop',
      stock: 50,
      isBestSeller: true,
    },
    {
      name: 'Teal Forest Cappuccino',
      description: 'Classic Italian coffee with double espresso and hot milk.',
      price: 32000,
      categoryId: getCatId('Coffee'),
      flavor: 'Pahit',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=85&fit=crop',
      stock: 50,
      isBestSeller: true,
    },
    {
      name: 'Midnight Cold Brew',
      description: 'Steeped for 18 hours in cold water, smooth and naturally sweet.',
      price: 35000,
      categoryId: getCatId('Coffee'),
      flavor: 'Segar',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=85&fit=crop',
      stock: 50,
    },
    {
      name: 'Sky Blue Flat White',
      description: 'Ristretto-based espresso with a thin layer of microfoam.',
      price: 30000,
      categoryId: getCatId('Coffee'),
      flavor: 'Pahit',
      image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=800&q=85&fit=crop',
      stock: 50,
    },
    {
      name: 'Sweet Teal Croissant',
      description: 'Buttery, flaky pastry with a touch of sweet essence.',
      price: 22000,
      categoryId: getCatId('Pastry'),
      flavor: 'Manis',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=85&fit=crop',
      stock: 20,
      isBestSeller: true,
    }
  ]

  console.log('Seeding v2.0 menu...')
  for (const item of menus) {
    await (prisma as any).menu.create({
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

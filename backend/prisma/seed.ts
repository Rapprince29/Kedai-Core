import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Create Sample Products
  const p1 = await prisma.product.create({
    data: {
      name: 'Kopi Susu Gula Aren',
      category: 'COFFEE',
      price: 18000,
      stockQty: 50,
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=200',
    },
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Croissant Butter',
      category: 'PASTRY',
      price: 25000,
      stockQty: 10,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=200',
    },
  });

  // 2. Create Sample Expenses
  await prisma.expense.createMany({
    data: [
      { description: 'Gaji Karyawan Shift Pagi', amount: 150000, category: 'SALARY' },
      { description: 'Tagihan Listrik April', amount: 500000, category: 'UTILITIES' },
    ],
  });

  // 3. Create Sample Transactions (Real-time data for Dashboard)
  const transaction = await prisma.transaction.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      totalPrice: 43000,
      paymentMethod: 'QRIS',
      status: 'COMPLETED',
      items: {
        create: [
          { productId: p1.id, qty: 1, subtotal: 18000 },
          { productId: p2.id, qty: 1, subtotal: 25000 },
        ],
      },
    },
  });

  console.log('✅ Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

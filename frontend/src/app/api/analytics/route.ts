import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Transaction, Menu } from '@prisma/client'

export async function GET() {
  try {
    const transactions: Transaction[] = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const totalRevenue = transactions.reduce((acc: number, t: Transaction) => acc + t.totalPrice, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = transactions.filter((t: Transaction) => new Date(t.createdAt) >= today);
    const todayRevenue = todayTransactions.reduce((acc: number, t: Transaction) => acc + t.totalPrice, 0);

    const menu: Menu[] = await prisma.menu.findMany();
    const inventoryAlerts = menu.filter((item: Menu) => item.stock < 10);

    // Group transactions by day for the last 7 days
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      const dayRevenue = transactions
        .filter((t: Transaction) => {
          const tDate = new Date(t.createdAt);
          return tDate >= d && tDate < nextD;
        })
        .reduce((acc: number, t: Transaction) => acc + t.totalPrice, 0);

      dailyTrend.push({
        date: d.toISOString().split('T')[0],
        amount: dayRevenue
      });
    }

    return NextResponse.json({
      totalRevenue,
      todayRevenue,
      totalTransactions: transactions.length,
      todayTransactionsCount: todayTransactions.length,
      inventoryAlertsCount: inventoryAlerts.length,
      dailyTrend,
      recentTransactions: transactions.slice(0, 5),
      lowStockItems: inventoryAlerts.slice(0, 5)
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

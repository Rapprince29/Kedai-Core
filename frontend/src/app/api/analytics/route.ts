import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const orders: any[] = await (prisma as any).order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const totalRevenue = orders.reduce((acc: number, t: any) => acc + (Number(t.totalPrice) || 0), 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter((t: any) => new Date(t.createdAt) >= today);
    const todayRevenue = todayOrders.reduce((acc: number, t: any) => acc + (Number(t.totalPrice) || 0), 0);

    const menu: any[] = await (prisma as any).menu.findMany();
    const inventoryAlerts = menu.filter((item: any) => (Number(item.stock) || 0) < 10);

    // Group transactions by day for the last 7 days
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      const dayRevenue = orders
        .filter((t: any) => {
          const tDate = new Date(t.createdAt);
          return tDate >= d && tDate < nextD;
        })
        .reduce((acc: number, t: any) => acc + (Number(t.totalPrice) || 0), 0);

      dailyTrend.push({
        date: d.toISOString().split('T')[0],
        amount: dayRevenue
      });
    }

    return NextResponse.json({
      totalRevenue,
      todayRevenue,
      totalTransactions: orders.length,
      todayTransactionsCount: todayOrders.length,
      inventoryAlertsCount: inventoryAlerts.length,
      dailyTrend,
      recentTransactions: orders.slice(0, 10).map(t => ({
        ...t,
        totalPrice: Number(t.totalPrice) || 0
      })),
      lowStockItems: inventoryAlerts.slice(0, 10)
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

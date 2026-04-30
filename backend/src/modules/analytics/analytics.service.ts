import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalSales, todaySales, totalTransactions, topProducts] = await Promise.all([
      // Total Sales
      this.prisma.transaction.aggregate({
        _sum: { totalPrice: true },
        where: { status: 'COMPLETED' },
      }),
      // Today Sales
      this.prisma.transaction.aggregate({
        _sum: { totalPrice: true },
        where: {
          status: 'COMPLETED',
          createdAt: { gte: today },
        },
      }),
      // Transaction Count
      this.prisma.transaction.count({
        where: { status: 'COMPLETED' },
      }),
      // Top Selling Products (Simple aggregation)
      this.prisma.transactionItem.groupBy({
        by: ['productId'],
        _sum: { qty: true },
        orderBy: {
          _sum: {
            qty: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    // Fetch product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          ...product,
          totalSold: item._sum?.qty || 0,
        };
      }),
    );


    return {
      totalRevenue: totalSales._sum.totalPrice || 0,
      todayRevenue: todaySales._sum.totalPrice || 0,
      totalTransactions,
      topProducts: topProductsWithDetails,
    };
  }

  async getWeeklySalesTrend() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sales = await this.prisma.transaction.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    });

    // Group by day (simplified)
    const trend = {};
    sales.forEach((s) => {
      const day = s.createdAt.toISOString().split('T')[0];
      trend[day] = (trend[day] || 0) + s.totalPrice;
    });

    return Object.entries(trend).map(([date, amount]) => ({ date, amount }));
  }
}

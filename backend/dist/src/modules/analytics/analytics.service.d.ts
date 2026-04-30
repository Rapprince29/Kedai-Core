import { PrismaService } from '../../prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalRevenue: any;
        todayRevenue: any;
        totalTransactions: any;
        topProducts: any;
    }>;
    getWeeklySalesTrend(): Promise<{
        date: string;
        amount: unknown;
    }[]>;
}

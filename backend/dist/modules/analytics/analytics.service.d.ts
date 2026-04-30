import { PrismaService } from '../../prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalRevenue: number;
        todayRevenue: number;
        totalTransactions: number;
        topProducts: {
            totalSold: number;
            id?: string | undefined;
            name?: string | undefined;
            category?: string | undefined;
            price?: number | undefined;
            stockQty?: number | undefined;
            reserveStockQty?: number | undefined;
            imageUrl?: string | null | undefined;
            isAvailable?: boolean | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        }[];
    }>;
    getWeeklySalesTrend(): Promise<{
        date: string;
        amount: unknown;
    }[]>;
}

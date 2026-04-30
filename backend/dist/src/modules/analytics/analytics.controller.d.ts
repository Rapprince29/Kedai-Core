import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(): Promise<{
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
    getWeeklyTrend(): Promise<{
        date: string;
        amount: unknown;
    }[]>;
}

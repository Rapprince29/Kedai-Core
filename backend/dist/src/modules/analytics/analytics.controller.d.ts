import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(): Promise<{
        totalRevenue: any;
        todayRevenue: any;
        totalTransactions: any;
        topProducts: any;
    }>;
    getWeeklyTrend(): Promise<{
        date: string;
        amount: unknown;
    }[]>;
}

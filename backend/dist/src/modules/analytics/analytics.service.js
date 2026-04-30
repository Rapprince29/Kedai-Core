"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalSales, todaySales, totalTransactions, topProducts] = await Promise.all([
            this.prisma.transaction.aggregate({
                _sum: { totalPrice: true },
                where: { status: 'COMPLETED' },
            }),
            this.prisma.transaction.aggregate({
                _sum: { totalPrice: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: { gte: today },
                },
            }),
            this.prisma.transaction.count({
                where: { status: 'COMPLETED' },
            }),
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
        const topProductsWithDetails = await Promise.all(topProducts.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            return {
                ...product,
                totalSold: item._sum?.qty || 0,
            };
        }));
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
        const trend = {};
        sales.forEach((s) => {
            const day = s.createdAt.toISOString().split('T')[0];
            trend[day] = (trend[day] || 0) + s.totalPrice;
        });
        return Object.entries(trend).map(([date, amount]) => ({ date, amount }));
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map
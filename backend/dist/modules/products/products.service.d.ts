import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        stockQty: number;
        reserveStockQty: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        stockQty: number;
        reserveStockQty: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: Prisma.ProductCreateInput): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        stockQty: number;
        reserveStockQty: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        stockQty: number;
        reserveStockQty: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        stockQty: number;
        reserveStockQty: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getLowStockAlerts(threshold?: number): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        stockQty: number;
        reserveStockQty: number;
        imageUrl: string | null;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}

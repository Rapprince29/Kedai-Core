import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
    getLowStock(threshold?: string): Promise<{
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
}

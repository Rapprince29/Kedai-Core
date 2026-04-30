import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(data: Prisma.ProductCreateInput): Promise<any>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<any>;
    remove(id: string): Promise<any>;
    getLowStockAlerts(threshold?: number): Promise<any>;
}

import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(data: Prisma.ProductCreateInput): Promise<any>;
    findAll(): Promise<any>;
    getLowStock(threshold?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<any>;
    remove(id: string): Promise<any>;
}

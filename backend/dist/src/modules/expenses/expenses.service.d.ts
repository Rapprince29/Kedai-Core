import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    create(data: Prisma.ExpenseCreateInput): Promise<any>;
    getSummary(): Promise<{
        totalExpenses: any;
    }>;
}

import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        date: Date;
        amount: number;
    }[]>;
    create(data: Prisma.ExpenseCreateInput): Promise<{
        id: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        date: Date;
        amount: number;
    }>;
    getSummary(): Promise<{
        totalExpenses: number;
    }>;
}

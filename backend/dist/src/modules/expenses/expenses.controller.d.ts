import { ExpensesService } from './expenses.service';
import { Prisma } from '@prisma/client';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
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

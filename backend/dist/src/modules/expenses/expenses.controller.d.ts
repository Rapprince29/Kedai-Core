import { ExpensesService } from './expenses.service';
import { Prisma } from '@prisma/client';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(): Promise<any>;
    create(data: Prisma.ExpenseCreateInput): Promise<any>;
    getSummary(): Promise<{
        totalExpenses: any;
    }>;
}

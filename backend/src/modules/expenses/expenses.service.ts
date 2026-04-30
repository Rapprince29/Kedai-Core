import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async create(data: Prisma.ExpenseCreateInput) {
    return this.prisma.expense.create({ data });
  }

  async getSummary() {
    const total = await this.prisma.expense.aggregate({
      _sum: { amount: true },
    });
    return {
      totalExpenses: total._sum.amount || 0,
    };
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Prisma } from '@prisma/client';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  @Post()
  create(@Body() data: Prisma.ExpenseCreateInput) {
    return this.expensesService.create(data);
  }

  @Get('summary')
  getSummary() {
    return this.expensesService.getSummary();
  }
}

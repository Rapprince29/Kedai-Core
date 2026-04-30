import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { OrderGateway } from './order.gateway';
import { ProductsModule } from './modules/products/products.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ExpensesModule } from './modules/expenses/expenses.module';

@Module({
  imports: [ProductsModule, AnalyticsModule, ExpensesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, OrderGateway],
})
export class AppModule {}




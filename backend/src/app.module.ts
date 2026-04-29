import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderGateway } from './order.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, OrderGateway],
})
export class AppModule {}

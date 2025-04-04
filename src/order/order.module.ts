import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module'; // Import ProductModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ProductModule, // Đảm bảo ProductModule được import vào OrderModule
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}

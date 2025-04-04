import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body() body: { customerName: string; productIds: number[] },
  ): Promise<Order> {
    return this.orderService.createOrder(body.customerName, body.productIds);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.getOrder(id);
  }
}

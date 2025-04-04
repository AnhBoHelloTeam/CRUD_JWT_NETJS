import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => Order)
  async getOrder(@Args('id', { type: () => Int }) id: number): Promise<Order> {
    return this.orderService.getOrder(id);
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('customerName') customerName: string,
    @Args('productIds', { type: () => [Int] }) productIds: number[],
  ): Promise<Order> {
    return this.orderService.createOrder(customerName, productIds);
  }
}

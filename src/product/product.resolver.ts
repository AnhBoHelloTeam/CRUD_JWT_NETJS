import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('name') name: string,
    @Args('price', { type: () => Int }) price: number,
    @Args('stock', { type: () => Int }) stock: number,
  ): Promise<Product> {
    return this.productService.create({ name, price, stock });
  }
}

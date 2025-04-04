import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() product: Product): Promise<Product> {
    return this.productService.create({
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // Thêm route để lấy sản phẩm theo ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}

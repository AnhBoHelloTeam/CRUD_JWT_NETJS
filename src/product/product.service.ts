import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Tạo sản phẩm mới
  async create(data: Partial<Product>): Promise<Product> {
    if (!data.name || !data.price || data.stock == null) {
      throw new BadRequestException('Thiếu thông tin sản phẩm: tên, giá, tồn kho');
    }

    try {
      const product = this.productRepository.create(data);
      return await this.productRepository.save(product);
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      throw new InternalServerErrorException('Không thể tạo sản phẩm');
    }
  }

  // Lấy tất cả sản phẩm
  async findAll(): Promise<Product[]> {
    try {
      const products = await this.productRepository.find();
      if (products.length === 0) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }
      return products;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả sản phẩm:', error);
      throw new InternalServerErrorException('Không thể lấy danh sách sản phẩm');
    }
  }

  // Lấy sản phẩm theo nhiều ID
  async findByIds(ids: number[]): Promise<Product[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Cần cung cấp danh sách ID sản phẩm');
    }

    try {
      const products = await this.productRepository.findBy({ id: In(ids) });
      if (products.length !== ids.length) {
        const notFoundIds = ids.filter(id => !products.some(product => product.id === id));
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${notFoundIds.join(', ')}`);
      }
      return products;
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm theo ID:', error);
      throw new InternalServerErrorException('Không thể lấy sản phẩm theo ID');
    }
  }

  // Lấy một sản phẩm theo ID
  async findOne(id: number): Promise<Product | null> {
    if (!id) {
      throw new BadRequestException('Cần cung cấp ID sản phẩm');
    }

    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
      }
      return product;
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm theo ID:', error);
      throw new InternalServerErrorException('Không thể lấy sản phẩm');
    }
  }

  // Xóa sản phẩm
  async remove(id: number): Promise<void> {
    if (!id) {
      throw new BadRequestException('Cần cung cấp ID sản phẩm');
    }

    try {
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      throw new InternalServerErrorException('Không thể xóa sản phẩm');
    }
  }
}

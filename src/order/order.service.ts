import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productService: ProductService,
  ) {}

  async createOrder(customerName: string, productIds: number[]): Promise<Order> {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new BadRequestException('Danh sách productIds không hợp lệ hoặc trống');
    }

    // Lấy tất cả sản phẩm từ cơ sở dữ liệu
    const products = await this.productService.findAll();

    // Lọc sản phẩm dựa trên các productIds
    const selectedProducts = products.filter(product =>
      productIds.includes(product.id),
    );

    // Kiểm tra nếu có sản phẩm không hợp lệ (ID không tồn tại)
    const invalidProductIds = productIds.filter(id => !selectedProducts.some(product => product.id === id));
    if (invalidProductIds.length > 0) {
      throw new BadRequestException(`Sản phẩm với ID ${invalidProductIds.join(', ')} không tồn tại`);
    }

    // Nếu không có sản phẩm hợp lệ
    if (selectedProducts.length === 0) {
      throw new BadRequestException('Không tìm thấy sản phẩm hợp lệ cho các ID đã cung cấp');
    }

    // Tạo đơn hàng
    const order = new Order();
    order.customerName = customerName;
    order.products = selectedProducts;
    order.totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    let savedOrder;
    try {
      // Lưu đơn hàng vào cơ sở dữ liệu và lấy về bản ghi đã lưu
      savedOrder = await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException('Tạo đơn hàng thất bại: ' + error.message);
    }

    // Kiểm tra nếu không có orderId
    if (!savedOrder.id) {
      throw new InternalServerErrorException('Tạo đơn hàng thất bại, không có orderId được tạo ra');
    }

    // Chèn sản phẩm vào bảng product_orders_order
    try {
      // Lấy dữ liệu cần thiết cho bảng liên kết
      const productOrders = selectedProducts.map(product => ({
        productId: product.id,
        orderId: savedOrder.id,
      }));

      // Lưu các bản ghi vào bảng liên kết
      const productOrderRepository = this.orderRepository.manager.getRepository('ProductOrdersOrder');
      await productOrderRepository.save(productOrders);
    } catch (error) {
      throw new InternalServerErrorException('Thêm sản phẩm vào đơn hàng thất bại: ' + error.message);
    }

    // Trả về đơn hàng đã lưu
    return savedOrder;
  }

  async getOrder(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    return order;
  }
}

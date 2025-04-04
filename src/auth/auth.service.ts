import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtToken } from './jwt-token.interface';  // Import JwtToken interface

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Đăng ký người dùng
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    // Kiểm tra nếu email hoặc username đã tồn tại
    const existingUser = await this.usersRepository.findOne({ where: [{ email }, { username }] });
    if (existingUser) {
      throw new BadRequestException('Tên người dùng hoặc email đã tồn tại');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Đăng ký người dùng thất bại: ' + error.message);
    }
  }

  // Đăng nhập và tạo JWT token
  async login(username: string, password: string): Promise<JwtToken> {
    // Tìm người dùng theo tên đăng nhập
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    // Tạo payload cho JWT token
    const payload = { username: user.username, sub: user.id };

    try {
      // Tạo và trả về JWT token
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi tạo token: ' + error.message);
    }
  }
}

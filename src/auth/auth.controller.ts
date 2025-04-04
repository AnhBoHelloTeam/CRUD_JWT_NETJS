import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { JwtToken } from './jwt-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<User> {  // Đảm bảo kiểu trả về là `User`
    return this.authService.register(username, email, password);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<JwtToken> {  // Đảm bảo kiểu trả về là `JwtToken`
    return this.authService.login(username, password);
  }
}

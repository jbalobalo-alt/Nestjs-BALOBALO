import { Controller, Post, Body, UseGuards, Request, Get, BadRequestException } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UsersService } from "../users/users.service";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string;  fullname: string; email: string} | undefined) {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }
    const { username, password, fullname, email } = body;
    if (!username || !password || !fullname || !email) {
      throw new BadRequestException('All fields are required: username, password, fullname, email');
    }
    return this.userService.createUser(username, password, fullname, email);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string } | undefined) {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('Username and password are required');
    }
    const user = await this.authService.validateUser(username, password);
    if (!user) return { error: 'Invalid credentials'};
    return this.authService.login(user);
  }
  

  @Post('logout')
   async logout(@Body() body: {userId: number } | undefined) {
    if (!body || !body.userId) {
      throw new BadRequestException('userId is required');
    }
    return this.authService.logout(body.userId);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string } | undefined) {
    if (!body || !body.refreshToken) {
      throw new BadRequestException('refreshToken is required');
    }
    return this.authService.refreshTokens(body.refreshToken);
  }
}
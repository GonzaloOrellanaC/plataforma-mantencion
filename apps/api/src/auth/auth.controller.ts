import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthUser } from './jwt.strategy';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('set-password')
  async setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto.token, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password, dto.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: ExpressRequest & { user?: AuthUser }) {
    // JwtStrategy attaches user info to request
    return { user: req.user };
  }
}

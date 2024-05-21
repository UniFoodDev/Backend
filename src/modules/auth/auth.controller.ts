import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { HttpCode, HttpStatus } from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPassworDto,
} from './dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(RefreshTokenGuard)
  @Post('refreshToken')
  async refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPassworDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}

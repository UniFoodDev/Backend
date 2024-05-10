import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import {
  ForgotPasswordDto,
  ResetPassworDto,
  LoginDto,
  RegisterDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('AUTH::USERNAME_OR_PASS_INCORRECT');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('AUTH::USERNAME_OR_PASS_INCORRECT');
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto);
    const user = await this.validateUser(loginDto.email, loginDto.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      status: 200,
      ...result,
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        // expiresIn: '2m',
        expiresIn: '7d',
      }),
      message: 'AUTH:LOGIN_SUCCESS',
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.userService.findByEmail(registerDto.email);
      if (user) {
        return {
          status: 401,
          message: 'AUTH::EMAIL_ALREADY_EXISTS',
        };
      }
      const newUser = await this.userService.create(registerDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser;
      const payload = {
        username: newUser.username,
        sub: newUser.id,
        roles: newUser.roles,
      };
      return {
        status: 201,
        ...result,
        accessToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1d',
        }),
        refreshToken: this.jwtService.sign(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          // expiresIn: '2m',
          expiresIn: '7d',
        }),
        message: 'AUTH::REGISTER_SUCCESS',
      };
    } catch (e) {
      console.log(e);
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  async refresh(user: any) {
    const payload = {
      userName: user.userName,
      sub: user.id,
      roles: user.roles,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        // expiresIn: '1m',
        expiresIn: '1d',
      }),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.userService.findByEmail(forgotPasswordDto.email);
      if (!user) {
        return {
          status: 401,
          message: 'AUTH::EMAIL_NOT_FOUND',
        };
      }
      if (user.isAccountBanned === true) {
        return {
          status: 403,
          message: 'AUTH::ACCOUNT_BANNED',
        };
      }
      const code = crypto.randomInt(100000, 1000000);
      const hashCode = await bcrypt.hash(code.toString(), 10);
      user.passwordCode = hashCode;
      console.log('1: ', hashCode);
      user.passwordCodeExpired = new Date(Date.now() + 5 * 60000);
      await Promise.all([
        this.userService.save(user),
        this.mailService.sendForgotPwdEmail({
          to: forgotPasswordDto.email,
          context: {
            OTP: code,
          },
        }),
      ]);
      return {
        status: 200,
        message: 'Send confirmation successfully.',
      };
    } catch (e) {}
  }
  async resetPassword(resetPassworDto: ResetPassworDto) {
    try {
      const user = await this.userService.findByEmail(resetPassworDto.email);
      const code = 'Uni' + crypto.randomInt(100000, 1000000);
      const isMatch = await bcrypt.compare(
        resetPassworDto.code.toString(),
        user.passwordCode,
      );
      console.log('2', user.passwordCode);
      console.log(isMatch);
      if (!isMatch) {
        return {
          status: 401,
          message: 'Code is incorrect',
        };
      }
      if (Date.now() >= user.passwordCodeExpired.getTime()) {
        return {
          status: 401,
          message: 'The confirmation code has expired',
        };
      }
      const hashCode = await bcrypt.hash(code, 10);
      user.password = hashCode;
      user.passwordCode = undefined;
      user.passwordCodeExpired = undefined;
      await Promise.all([
        this.userService.save(user),
        this.mailService.sendResetPwdEmail({
          to: resetPassworDto.email,
          context: {
            password: code,
          },
        }),
      ]);
      return {
        status: 200,
        message: 'AUTH::RESET_PWD_SENT',
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('AUTH::RESET_PASSWORD_FAILED');
    }
  }
}

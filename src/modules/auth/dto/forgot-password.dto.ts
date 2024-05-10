import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID' })
  email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber } from 'class-validator';

export class ResetPassworDto {
  @ApiProperty()
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID' })
  email: string;

  @IsNumber(
    {},
    {
      message: 'CODE::IS_NOT_NUMBER',
    },
  )
  code: number;
}

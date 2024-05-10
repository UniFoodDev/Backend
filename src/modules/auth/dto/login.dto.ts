import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

import { passwordRegex } from '../../../libs/regex';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID' })
  email: string;

  @ApiProperty()
  @IsString({
    message: 'USER::PASSWORD_IS_REQUIRED',
  })
  @Matches(new RegExp(passwordRegex, 'i'), {
    message: 'AUTH::PASSWORD_INVALID_FORMAT',
  })
  password: string;
}

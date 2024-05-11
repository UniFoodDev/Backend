import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';

import { passwordRegex } from '../../../libs/regex';
import { Role } from '../../../enums/role.enum';

export class RegisterDto {
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

  @ApiProperty()
  @IsString({
    message: 'USER::NAME_IS_REQUIRED',
  })
  username: string;

  @IsEnum(Role, { each: true })
  roles: Role[];
}

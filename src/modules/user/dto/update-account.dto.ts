import {
  IsString,
  IsEnum,
  IsOptional,
  Length,
  Matches,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { Role } from '../../../enums/role.enum';
import { passwordRegex, usernameRegex } from '../../../libs/regex';

export class UpdateAccountDto {
  @Length(6, 32)
  @Matches(usernameRegex, {
    message:
      'Username must contains at least 6 letter, no space, no special letters',
  })
  username: string;

  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  roles: Role[];

  @IsString()
  address: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;
}

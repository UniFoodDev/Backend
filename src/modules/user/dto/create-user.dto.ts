import { Length, Matches, IsEmail, IsEnum } from 'class-validator';
import { passwordRegex, usernameRegex } from '../../../libs/regex';
import { Role } from '../../../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @Length(6, 32)
  @Matches(usernameRegex, {
    message:
      'Username must contains at least 6 letter, no space, no special letters',
  })
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  password: string;

  @ApiProperty()
  @IsEnum(Role, { each: true })
  roles: Role[];
}

import { Length, Matches, IsEmail, IsEnum } from 'class-validator';
import { passwordRegex, usernameRegex } from '../../../libs/regex';
import { Role } from '../../../enums/role.enum';

export class CreateUserDto {
  @Length(6, 32)
  @Matches(usernameRegex, {
    message:
      'Username must contains at least 6 letter, no space, no special letters',
  })
  username: string;

  @IsEmail()
  email: string;

  @Length(6, 32)
  @Matches(passwordRegex, {
    message: 'Password must contains at least 1 number and uppercase letter',
  })
  password: string;

  @IsEnum(Role, { each: true })
  roles: Role[];
}

import { IsEnum } from 'class-validator';
import { Role } from '../../../enums/role.enum';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto extends CreateUserDto {
  @ApiProperty()
  @IsEnum(Role, { each: true })
  roles: Role[];
}

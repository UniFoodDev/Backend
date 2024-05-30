// address.dto.ts
import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  home: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}

// address.dto.ts
import { IsString, IsPhoneNumber } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  home: string;

  @IsPhoneNumber()
  phone: string;
}

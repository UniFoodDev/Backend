// address.dto.ts
import { IsString } from 'class-validator';
// lam nhu shoppee
export class CreateAddressDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  home: string;

  @IsString()
  phone: string;
}

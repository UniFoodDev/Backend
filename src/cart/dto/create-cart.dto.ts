import { Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';

class UserDto {
  @IsInt()
  id: number;
}

class CartItemDto {
  @IsOptional()
  @IsInt()
  cartId: number;

  @IsInt()
  variantId: number;

  @IsInt()
  orderedPrice: number;

  @IsInt()
  orderedQuantity: number;
}

export class CreateCartDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => CartItemDto)
  cartItems: CartItemDto[];
}

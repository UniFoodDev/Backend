import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaymentType } from './../../enums/payment-type.enum';

class UserDto {
  @IsInt()
  id: number;
}

class OrderItemDto {
  @IsOptional()
  @IsInt()
  orderId: number;

  @IsInt()
  variantId: number;

  @IsInt()
  orderedPrice: number;

  @IsInt()
  orderedQuantity: number;
}

export class CreateOrderDto {
  @IsString()
  fullName: string;

  @IsInt()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  note: string;

  @IsOptional()
  @IsInt()
  shippingCost: number;

  @IsInt()
  totalPrice: number;

  @IsEnum(PaymentType)
  paymentMethod: PaymentType;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

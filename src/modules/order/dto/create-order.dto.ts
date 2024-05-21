import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentType } from '../../../enums';

export class ProductDTO {
  @IsInt()
  id: number;
}

export class AttributeValueDTO {
  @IsInt()
  id: number;
}

export class AttributeValueVariantDTO {
  @ValidateNested({ each: true })
  @Type(() => AttributeValueDTO)
  attributeValue: AttributeValueDTO[];
}

export class ProductArrayDTO {
  @ValidateNested()
  @Type(() => ProductDTO)
  product: ProductDTO;

  @ValidateNested({ each: true })
  @Type(() => AttributeValueVariantDTO)
  attributeValueVariant: AttributeValueVariantDTO[];
}

class UserDto {
  @IsInt()
  id: number;
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
  @IsString()
  shippingCost: string;

  @IsString()
  totalPrice: string;

  @IsEnum(OrderStatus, { each: true })
  orderStatus: OrderStatus[];

  @IsEnum(PaymentType, { each: true })
  paymentMethod: PaymentType[];

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;
}

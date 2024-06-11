import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentType } from '../../../enums';

class ProductDto {
  @IsInt()
  id: number;

  @IsString()
  count: string;
}

class AttributeValueDto {
  @IsInt()
  id: number;
}

class AttributeValueVariantDto {
  @ValidateNested()
  @Type(() => AttributeValueDto)
  attributeValue: AttributeValueDto;
}

class ProductArrayDTO {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeValueVariantDto)
  attributeValueVariant: AttributeValueVariantDto[];
}

class UserDto {
  @IsInt()
  id: number;
}

export class CreateOrderDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  note: string;

  @IsEnum(PaymentType, { each: true })
  paymentMethod: PaymentType;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductArrayDTO)
  productArrayDTOWrapper: ProductArrayDTO[];
}

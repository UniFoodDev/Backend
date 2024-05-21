import { Type } from 'class-transformer';
import { IsInt, ValidateNested, IsArray } from 'class-validator';

class ProductDto {
  @IsInt()
  id: number;
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

export class CreateVariantDto {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeValueVariantDto)
  attributeValueVariant: AttributeValueVariantDto[];
}

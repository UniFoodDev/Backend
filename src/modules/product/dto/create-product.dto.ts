import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { nameRegex } from '../../../libs/regex';

class Tag {
  @IsInt()
  id: number;
}

class Attribute {
  @IsInt()
  id: number;
}

class CategoryDto {
  @IsInt()
  id: number;
}

class ImageDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  publicId: string;

  @IsString()
  url: string;
}

class TagProductDto {
  @IsOptional()
  @IsInt()
  id: number;

  @ValidateNested()
  @Type(() => Tag)
  tag: Tag;
}

class AttributeProductsDto {
  @IsOptional()
  @IsInt()
  id: number;

  @ValidateNested()
  @Type(() => Attribute)
  attribute: Attribute;
}

export class CreateProductDto {
  @Length(2, 200)
  @Matches(nameRegex, {
    message: 'Tên phải chứa ít nhất 2 chữ cái và không có ký tự đặc biệt',
  })
  name: string;

  @IsString()
  price: string;

  @IsString()
  description: string;

  @IsInt()
  rating: number;

  @IsInt()
  discount: number;

  @IsInt()
  sales: number;

  @IsInt()
  amount: number;

  @ValidateNested()
  @Type(() => ImageDto)
  images: ImageDto[];

  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ValidateNested()
  @Type(() => TagProductDto)
  tag_product: TagProductDto[];

  @ValidateNested()
  @Type(() => AttributeProductsDto)
  attributeProducts: AttributeProductsDto[];
}

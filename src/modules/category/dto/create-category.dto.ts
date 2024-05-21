import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { nameRegex } from '../../../libs/regex';
import { Type } from 'class-transformer';

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

export class CreateCategoryDto {
  @Length(2, 200)
  @Matches(nameRegex, {
    message: 'Name must contains at least 2 letter, no special letters',
  })
  name: string;

  @IsString()
  @MaxLength(200)
  description: string;

  @IsBoolean()
  isActive: boolean;

  @ValidateNested()
  @Type(() => ImageDto)
  images: ImageDto[];
}

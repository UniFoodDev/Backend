import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from '../attribute/attribute.module';
import { CategoryModule } from '../category/category.module';
import { Image } from '../image/entities/image.entity';
import { Variant } from '../variant/entities/variant.entity';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AttributeProduct } from '../attribute/entities/attribute_product.entity';
import { TagProduct } from '../tag/entities/tag_product.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Image,
      Variant,
      AttributeProduct,
      TagProduct,
    ]),
    CategoryModule,
    TagModule,
    AttributeModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

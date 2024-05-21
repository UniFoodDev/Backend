import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';
import { AttributeValueModule } from '../attribute-value/attribute-value.module';
import { AttributeValueVariant } from '../attribute-value/entities/attribute_value_variant.entity';
import { AttributeValue } from '../attribute-value/entities/attribute-value.entity';
import { ProductModule } from '../product/product.module';
import { Product } from '../product/entities/product.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Variant,
      AttributeValueVariant,
      AttributeValue,
      Product,
    ]),
    forwardRef(() => AttributeValueModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}

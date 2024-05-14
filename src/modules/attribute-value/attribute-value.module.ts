import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModule } from '../attribute/attribute.module';
import { Variant } from '../variant/entities/variant.entity';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValue } from './entities/attribute-value.entity';
import { AttributeValueVariant } from './entities/attribute_value_variant.entity';
import { AttributeValueController } from './attribute-value.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttributeValue, Variant, AttributeValueVariant]),
    AttributeModule,
  ],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
  exports: [AttributeValueService],
})
export class AttributeValueModule {}

import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrderAdminController, OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AttributeValueModule } from '../attribute-value/attribute-value.module';
import { VariantModule } from '../variant/variant.module';
import { AttributeValueVariant } from '../attribute-value/entities/attribute_value_variant.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { AttributeValue } from '../attribute-value/entities/attribute-value.entity';
import { Product } from '../product/entities/product.entity';
import { Variant } from '../variant/entities/variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      AttributeValueVariant,
      User,
      AttributeValue,
      Product,
      Variant,
    ]),
    HttpModule,
    forwardRef(() => AttributeValueModule),
    forwardRef(() => VariantModule),
    forwardRef(() => UserModule),
  ],
  controllers: [OrderController, OrderAdminController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

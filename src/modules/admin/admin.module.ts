import { Module } from '@nestjs/common';
import { ProductAdminController } from './admin_product.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { UserAdminController } from './admin_user.controller';
import { AttributeModule } from '../attribute/attribute.module';
import { AttributeAdminController } from './admin_attribute.controller';
import { AttributeValueAdminController } from './admin_attributeValue.controller';
import { AttributeValueModule } from '../attribute-value/attribute-value.module';
import { CategoryModule } from '../category/category.module';
import { CategoryAdminController } from './admin_category.controller';
import { TagModule } from '../tag/tag.module';
import { TagAdminController } from './admin_tag.controller';
import { OrderModule } from '../order/order.module';
import { OrderAdminController } from './admin_order.controller';

@Module({
  imports: [
    ProductModule,
    UserModule,
    AttributeModule,
    AttributeValueModule,
    CategoryModule,
    TagModule,
    OrderModule,
  ],
  controllers: [
    ProductAdminController,
    UserAdminController,
    AttributeAdminController,
    AttributeValueAdminController,
    CategoryAdminController,
    TagAdminController,
    OrderAdminController,
  ],
  providers: [],
})
export class AdminModule {}

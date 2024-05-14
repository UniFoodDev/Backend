import { Module } from '@nestjs/common';
import { ProductAdminController } from './admin_product.controller';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { UserAdminController } from './admin_user.controller';
import { AttributeModule } from '../attribute/attribute.module';
import { AttributeAdminController } from './admin_attribute.controller';
import { AttributeValueAdminController } from './admin_attributeValue.controller';
import { AttributeValueModule } from '../attribute-value/attribute-value.module';

@Module({
  imports: [ProductModule, UserModule, AttributeModule, AttributeValueModule],
  controllers: [
    ProductAdminController,
    UserAdminController,
    AttributeAdminController,
    AttributeValueAdminController,
  ],
  providers: [],
})
export class AdminModule {}

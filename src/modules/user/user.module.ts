import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CartItem } from 'src/modules/cart/entities/cartItem.entity';
import { Address } from './entities/address.entity';
import { TagModule } from '../tag/tag.module';
import { forwardRef } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CartItem, Address]),
    forwardRef(() => TagModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CategoryModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CartItem } from 'src/modules/cart/entities/cartItem.entity';
import { Address } from './entities/address.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, CartItem, Address])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

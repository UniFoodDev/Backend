import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController, UserAdminController } from './user.controller';
import { UserService } from './user.service';
import { CartItem } from 'src/modules/cart/entities/cartItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CartItem])],
  controllers: [UserController, UserAdminController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

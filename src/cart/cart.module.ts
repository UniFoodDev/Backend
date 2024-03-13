import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { OrderAdminController, OrderController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), HttpModule],
  controllers: [OrderController, OrderAdminController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
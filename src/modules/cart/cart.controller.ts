import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../decorator/role.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // make new cart
  // later needed to modify: only user can have cart
  @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Patch()
  patch(@Body() UpdateCartDto: UpdateCartDto) {
    return this.cartService.update(UpdateCartDto);
  }

  // get all the cart items of an user
  @Roles(Role.User)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('items')
  findAll(@Query('userId') userId: number): Promise<Cart> {
    return this.cartService.findAll({ id : userId});
  }
}


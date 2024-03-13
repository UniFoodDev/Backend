import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateCartDto, UserDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepo: Repository<CartItem>,
  ) {}

  // create new cart (call once)
  async create(createCartDto: CreateCartDto) {
    const { cartItems } = createCartDto;
    const cart = await this.cartRepo.save(createCartDto);

    const newCartItems = cartItems.map((o) => ({ ...o, cartId: cart.id }));
    await this.cartItemsRepo.save(newCartItems);
    return cart;
  }

  // update cart
  // need modify later to reduce data size transfered
  async update(updateCartDto: UpdateCartDto) {
    const exist = await this.cartRepo.findOneBy({ user: updateCartDto.user });
    if (!exist) {
      throw new NotFoundException('Cart not found.');
    }
    const cartId = exist.id
    const { cartItems } = updateCartDto;
    await this.cartItemsRepo.save(cartItems);
    return this.cartRepo.save({ cartId, ...updateCartDto });
  }

  // find all the cart items of an user
  async findAll(user: UserDto) {
    const cart = await this.cartRepo.findOneBy({ id: user.id })
    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const cartItems = await this.cartItemsRepo.findBy({ cartId: cart.id });
    return { ...cart, cartItems };
  }
}

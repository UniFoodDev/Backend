import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { firstValueFrom } from 'rxjs';
import { Like, Raw, Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
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
    private readonly httpService: HttpService,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const { cartItems } = createCartDto;
    const cart = await this.cartRepo.save(createCartDto);

    const newCartItems = cartItems.map((o) => ({ ...o, cartId: cart.id }));
    await this.cartItemsRepo.save(newCartItems);
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    const exist = await this.cartRepo.findOneBy({ id });
    if (!exist) {
      throw new NotFoundException('Cart not found.');
    }

    const { cartItems } = updateCartDto;
    await this.cartItemsRepo.save(cartItems);
    return this.cartRepo.save({ id, ...updateCartDto });
  }
}

import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { Pagination } from 'nestjs-typeorm-paginate';
  import { Roles } from '../decorator/role.decorator';
  import { AccessTokenGuard } from './../auth/access-token.guard';
  import { Role } from './../enums/role.enum';
  import { RolesGuard } from './../guards/roles.guard';
  import { CreateCartDto } from './dto/create-cart.dto';
  import { Order } from './entities/order.entity';
  import { OrderService } from './order.service';
  import { UpdateCartDto } from './dto/update-cart.dto';
  import { Cart } from './entities/cart.entity';
  
  @Controller('cart')
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Post('list')
    getOrderList(
      @Body() body,
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
      @Query('type', new DefaultValuePipe(10), ParseIntPipe) type = 0,
    ): Promise<Pagination<Order>> {
      limit = limit > 100 ? 100 : limit;
      const userId: number = body.userId;
      return this.orderService.findUserOrders(
        {
          page,
          limit,
          route: `${process.env.SERVER}/order/list`,
        },
        type,
        userId,
      );
    }
  
    @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Post()
    create(@Body() createCartDto: CreateCartDto) {
      return this.cartService.create(createCartDto);
    }
  
    @Roles(Role.Admin, Role.User, Role.Manager, Role.Employee)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.orderService.findOne(id);
    }
  }
  
  @Controller('admin/order')
  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  export class OrderAdminController {
    constructor(private readonly orderService: OrderService) {}
  
    @Get('sales-statistic')
    async salesStatistic(
      @Query('year') year = new Date().getFullYear().toString(),
    ) {
      return this.orderService.salesStatistic(year);
    }
  
    @Get('overview')
    async overview() {
      return this.orderService.overview();
    }
  
    @Get('total-revenue')
    async totalRevenue() {
      return this.orderService.calculateTotalRevenue();
    }
  
    @Get('total-order')
    async totalOrder() {
      return this.orderService.count();
    }
  
    @Get()
    async findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
      @Query('name') name = '',
    ): Promise<Pagination<Order>> {
      limit = limit > 100 ? 100 : limit;
      return this.orderService.findAll(
        {
          page,
          limit,
          route: `${process.env.SERVER}/admin/order`,
        },
        name,
      );
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() UpdateCartDto: UpdateCartDto,
    ) {
      return this.orderService.update(id, UpdateCartDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.orderService.remove(id);
    }
  }
  
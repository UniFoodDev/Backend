import {
  Controller,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Post,
} from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { UpdateOrderStatusDto } from '../order/dto';
import { Get } from '@nestjs/common';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../enums';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../../guards/roles.guard';

@Controller('api/admin/order')
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Patch('update-status/:id')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('getAllOrder')
  async getAllOrder() {
    return this.orderService.adminGetAllOrders();
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('getOrder/PriceAndOrder')
  async getOrder() {
    return this.orderService.getAllPriceAndOrder();
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('getOrder/product/getBestSellingProduct')
  async getOrderById() {
    return this.orderService.getBestSellingProduct();
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('monthlyCostsAndRevenue')
  async getMonthlyCostsAndRevenue(@Body() body: { year: string }) {
    return this.orderService.getMonthlyCostsAndRevenue(body.year);
  }

  @Roles(Role.Admin, Role.Manager, Role.Employee)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('getOrder/by/:id')
  findOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }
}

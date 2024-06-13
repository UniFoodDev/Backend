import {
  Controller,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
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
}

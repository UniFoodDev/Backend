import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { UpdateOrderStatusDto } from '../order/dto';

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
}

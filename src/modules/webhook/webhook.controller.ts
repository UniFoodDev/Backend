import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('webhook/payment')
@Controller('api/payment')
export class WebhookController {
  private readonly webhookService: WebhookService;
  constructor() {
    this.webhookService = new WebhookService();
  }

  @Post('callback')
  async webhook(@Body() orderId: number, data: any) {
    return this.webhookService.webhook(orderId, data);
  }
}

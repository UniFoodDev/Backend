import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  private readonly webhookService: WebhookService;
  constructor() {
    this.webhookService = new WebhookService();
  }

  @Post()
  async webhook(@Body() data: any) {
    return this.webhookService.webhook(data);
  }
}

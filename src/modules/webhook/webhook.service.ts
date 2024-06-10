import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  async webhook(orderId: number, data: any) {
    return 'The data is ' + data.message;
  }
}

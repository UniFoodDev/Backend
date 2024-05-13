import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  async webhook(data: any) {
    return 'The data is ' + data.message;
  }
}

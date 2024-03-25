import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
    async webhook(){
        return 'Webhook received';
    }
}

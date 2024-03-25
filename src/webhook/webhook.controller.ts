import { Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    private readonly webhookService: WebhookService;
    constructor(){
        this.webhookService = new WebhookService();
    }
    
    @Post()
    async webhook(){
        return this.webhookService.webhook();
    }
}

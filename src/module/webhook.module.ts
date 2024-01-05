import { Module } from '@nestjs/common';

import { WebhookController } from 'controller';
import { UniTalkWebhookHandlerService } from '../service/unitalk';
import { CallService } from '../service/call';
import { CallRepository } from '../repository';

@Module({
	imports: [],
	controllers: [WebhookController],
	providers: [UniTalkWebhookHandlerService, CallService, CallRepository],
})
export class WebhookModule {}

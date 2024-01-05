import { Body, Controller, HttpStatus, Post, Headers } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { RegionListResponse } from 'interface/apiResponse';
import {
	UnitalkCallNewRequest,
	UnitalkCallAnswerRequest,
	UnitalkCallEndedRequest,
	UnitalkIvrActionRequest,
} from '../interface/apiRequest';
import { UniTalkWebhookHandlerService } from '../service/unitalk';

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhookController {
	constructor(private readonly unitalkWebhookHandler: UniTalkWebhookHandlerService) {}

	@Post('/unitalk')
	@ApiResponse({ status: HttpStatus.OK, type: RegionListResponse })
	public async handleUnitalkWebhook(
		@Body() body: UnitalkCallNewRequest | UnitalkCallAnswerRequest | UnitalkCallEndedRequest | UnitalkIvrActionRequest,
		@Headers() headers: Headers,
	): Promise<any> {
		await this.unitalkWebhookHandler.handle(body);
	}
}

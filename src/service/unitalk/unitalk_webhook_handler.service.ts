import { Injectable } from '@nestjs/common';
import { CallService } from '../call';
import {
	UnitalkCallAnswerRequest,
	UnitalkCallEndedRequest,
	UnitalkCallNewRequest,
	UnitalkIvrActionRequest,
} from '../../interface/apiRequest';
import { CallStatus, IvrInteraction } from '../../entity/call.entity';
import { Result } from '../../shared/util/util';
import { ApplicationError } from '../../shared/error';

export interface CallMeta {
	callId: number;
}

@Injectable()
export class UniTalkWebhookHandlerService {
	constructor(private readonly callService: CallService) {}

	public async handle(
		body: UnitalkCallNewRequest | UnitalkCallAnswerRequest | UnitalkCallEndedRequest | UnitalkIvrActionRequest,
	) {
		switch (body.event) {
			case 'CALL_NEW': {
				const meta: Result<CallMeta> = body.call.meta && JSON.parse(body.call.meta);

				if (!meta) {
					throw new RequestHasNoMetaError();
				}

				const call = await this.callService.getById(meta.callId);

				call.status = CallStatus.Initiated;

				await this.callService.update(call);
				break;
			}
			case 'CALL_ANSWER': {
				const meta: Result<CallMeta> = body.call.meta && JSON.parse(body.call.meta);

				if (!meta) {
					throw new RequestHasNoMetaError();
				}

				const call = await this.callService.getById(meta?.callId);

				call.status = CallStatus.Answered;
				call.answeredAt = new Date();

				await this.callService.update(call);
				break;
			}
			case 'CALL_ENDED': {
				const meta: Result<CallMeta> = body.call.meta && JSON.parse(body.call.meta);

				if (!meta) {
					throw new RequestHasNoMetaError();
				}

				const call = await this.callService.getById(meta?.callId);

				call.status = CallStatus.Answered;
				call.hungupdAt = new Date();

				await this.callService.update(call);
				break;
			}
			case 'IVR_ACTION': {
				const meta: Result<CallMeta> = body.meta && JSON.parse(body.meta);

				if (!meta) {
					throw new RequestHasNoMetaError();
				}

				const call = await this.callService.getById(meta?.callId);

				call.ivrInteraction = body.pressedDigit === 1 ? IvrInteraction.Accepted : IvrInteraction.Denied;
				call.answeredAt = new Date();

				await this.callService.update(call);
				break;
			}
		}
	}
}

export class RequestHasNoMetaError extends ApplicationError {}

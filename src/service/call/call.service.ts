import { Injectable } from '@nestjs/common';

import { Call } from '../../model';
import { CallStatus, IvrInteraction } from '../../entity/call.entity';
import { CallRepository } from '../../repository';
import { ApplicationError } from '../../shared/error';

@Injectable()
export class CallService {
	constructor(private readonly callRepository: CallRepository) {}

	public async getById(callId: number): Promise<Call> {
		const call = await this.callRepository.getById(callId);

		if (!call) {
			throw new CalNotExistsError();
		}

		return call;
	}

	public async getByUserIdAndIncidentId(userId: number, incidentId: number): Promise<Call> {
		const call = await this.callRepository.getByUserIdAndIncidentId(userId, incidentId);

		if (!call) {
			throw new CalNotExistsError();
		}

		return call;
	}

	public async update(call: Call): Promise<Call> {
		return this.callRepository.update(call);
	}

	public async setStatus(call: Call, status: CallStatus): Promise<Call> {
		return this.callRepository.setStatus(call, status);
	}

	public async setIvrInteraction(call: Call, ivrInteraction: IvrInteraction): Promise<Call> {
		return this.callRepository.setIvrInteraction(call, ivrInteraction);
	}
}

export class CalNotExistsError extends ApplicationError {}

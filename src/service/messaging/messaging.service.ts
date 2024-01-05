import { Injectable } from '@nestjs/common';

import { Call, Incident, User } from 'model';
import { UnitalkService } from 'service/unitalk';
import { CallStatus, IvrInteraction } from 'entity/call.entity';
import { CallRepository } from 'repository';
import { SMS } from 'value_object/sms';
import { Audio } from 'value_object/audio';
import { AsyncAction } from 'shared/async_action';

@Injectable()
export class MessagingService {
	constructor(
		private readonly uniTalkService: UnitalkService,
		private readonly callRepository: CallRepository,
	) {}

	public async enqueueIncidentCalls(incident: Incident, users: Array<User>): Promise<void> {
		let audio = new Audio(incident);
		audio = await this.uniTalkService.createNewAudio(audio);

		const enqueueCallsAsyncAction = new AsyncAction('enqueue:calls:async:action', async () => {
			await Promise.all(
				users.map(async user => {
					let call = new Call(
						`incident:${incident.id}-user:${user.id}`,
						CallStatus.NotInitiated,
						IvrInteraction.Ignored,
						incident.id,
						user.id,
					);
					call = await this.callRepository.insert(call);

					await this.uniTalkService.enqueueCall(user.phone, audio, { callId: call.id });
				}),
			);
		});

		enqueueCallsAsyncAction.run();
	}

	public async sendIncidentSMSs(incident: Incident, users: Array<User>): Promise<void> {
		const sendSMSAsyncAction = new AsyncAction('send:sms:async:action', async () => {
			await Promise.all(
				users.map(async user => {
					const sms = new SMS(incident, user);

					await this.uniTalkService.sendSMS(sms);
				}),
			);
		});

		sendSMSAsyncAction.run();
	}
}

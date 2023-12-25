import { Injectable } from '@nestjs/common';

import { Call, Incident, User } from 'model';
import { UniTalkService } from 'service/unitalk';
import { CallStatus } from 'entity/call.entity';
import { CallRepository } from 'repository';
import { SMS } from 'value_object/sms';
import { Audio } from 'value_object/audio';
import { AsyncAction } from 'shared/async_action';

@Injectable()
export class MessagingService {
	constructor(
		private readonly uniTalkService: UniTalkService,
		private readonly callRepository: CallRepository,
	) {}

	public async enqueueIncidentCalls(incident: Incident, users: Array<User>): Promise<void> {
		let audio = new Audio(incident);
		audio = await this.uniTalkService.createNewAudio(audio);

		const enqueueCallsAsyncAction = new AsyncAction('enqueue:calls:async:action', async () => {
			await Promise.all(
				users.map(async user => {
					const call = new Call(
						`incident:${incident.id}-user:${user.id}`,
						CallStatus.NotInitiated,
						incident.id,
						user.id,
					);
					await this.callRepository.insert(call);

					await this.uniTalkService.enqueueCall(user.phone, audio);
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

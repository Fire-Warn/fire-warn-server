import { NEW_ID } from 'shared/util/util';
import { CallStatus, IvrInteraction } from '../entity/call.entity';

export class Call {
	constructor(
		public readonly name: string,
		public status: CallStatus = CallStatus.NotInitiated,
		public ivrInteraction: IvrInteraction = IvrInteraction.Ignored,
		public readonly incidentId: number,
		public readonly userId: number,
		public answeredAt?: Date,
		public hungupdAt?: Date,
		public readonly id = NEW_ID,
	) {}
}

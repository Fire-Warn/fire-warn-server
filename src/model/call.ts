import { NEW_ID } from 'shared/util/util';
import { CallStatus } from '../entity/call.entity';

export class Call {
	constructor(
		public readonly name: string,
		public readonly status: CallStatus,
		public readonly incidentId: number,
		public readonly userId: number,
		public readonly answeredAt?: Date,
		public readonly hungupdAt?: Date,
		public readonly id = NEW_ID,
	) {}
}

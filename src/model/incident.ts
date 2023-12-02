import { NEW_ID } from 'shared/util/util';

export class Incident {
	constructor(
		public readonly address: string,
		public readonly description: string,
		public readonly regionId: number,
		public readonly communityId: number,
		public readonly createdUserId: number,
		public readonly id = NEW_ID,
		public readonly createdAt: Date = new Date(),
	) {}
}

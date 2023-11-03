import { NEW_ID } from 'shared/util/util';
import { UserRole } from 'entity/user.entity';

export class Community {
	constructor(
		public readonly name: string,
		public readonly regionId: number,
		public readonly id: number = NEW_ID,
	) {}
}

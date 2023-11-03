import { NEW_ID } from 'shared/util/util';
import { UserRole } from 'entity/user.entity';

export class Region {
	constructor(
		public readonly name: string,
		public readonly id: number = NEW_ID,
	) {}
}

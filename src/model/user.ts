import { NEW_ID } from 'shared/util/util';
import { UserRole } from 'entity/user.entity';

export class User {
	constructor(
		public readonly email: string,
		public readonly phone: string,
		public readonly firstName: string,
		public readonly lastName: string,
		public readonly role: UserRole,
		public readonly regionId: number,
		public readonly districtId?: number, // NULL for Admin, Regional Admin
		public readonly communityId?: number, // NULL for Admin, Regional Admin, Operator
		public readonly id: number = NEW_ID,
	) {}

	public is(role: UserRole): boolean {
		return this.role === role;
	}
}

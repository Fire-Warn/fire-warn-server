import { NEW_ID } from 'shared/util/util';

export class Community {
	constructor(
		public readonly name: string,
		public readonly regionId: number,
		public readonly districtId: number,
		public readonly id: number = NEW_ID,
	) {}
}

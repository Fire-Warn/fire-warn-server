import { NEW_ID } from 'shared/util/util';

export class District {
	constructor(
		public readonly name: string,
		public readonly regionId: number,
		public readonly id: number = NEW_ID,
	) {}
}

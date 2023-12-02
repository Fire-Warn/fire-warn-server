import { NEW_ID } from 'shared/util/util';

export class Call {
	constructor(
		public readonly status: string,
		public readonly to: string,
		public id = NEW_ID,
	) {}
}

import { NEW_ID } from 'shared/util/util';

export class Audio {
	constructor(
		public readonly name: string,
		public id = NEW_ID,
	) {}

	public get text(): string {
		return 'Доброго дня. Це тестове аудіо створене для продзвону людей';
	}
}

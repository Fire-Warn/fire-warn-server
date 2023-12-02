import { NEW_ID } from 'shared/util/util';
import { Incident } from 'model';

export class Audio {
	private readonly randNumber = Math.trunc(Math.random() * 10);

	constructor(
		public readonly incident: Incident,
		public id = NEW_ID,
	) {}

	public get text(): string {
		return `Пожежа за адресою "${this.incident.address}"`;
	}

	public get name(): string {
		return `Incident-${this.incident.id}-${this.randNumber}`;
	}
}

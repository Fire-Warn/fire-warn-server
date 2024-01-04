import { Incident, User } from 'model';

export class SMS {
	constructor(
		private readonly incident: Incident,
		public readonly user: User,
	) {}

	public get text(): string {
		const text = `Доброго дня, ${this.user.firstName} ${this.user.lastName}! 
		Новий інцидент за адресою "${this.incident.address}". 
		Опис інциденту: ${this.incident.description}`;

		return text
			.split(`\n`)
			.map(l => l.trim())
			.join('\n');
	}
}

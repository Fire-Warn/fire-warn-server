import { Incident, User } from 'model';

export class SMS {
	constructor(
		private readonly incident: Incident,
		public readonly user: User,
	) {}

	public get text(): string {
		return `Доброго дня, ${this.user.firstName} ${this.user.lastName}! 
		Новий інцидент за адресою "${this.incident.address}". 
		Опис інциденту: ${this.incident.description}`;
	}
}

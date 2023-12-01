import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { IncidentEntity } from './incident.entity';

export enum CallStatus {
	NotInitiated = 'NotInitiated',
	Initiated = 'Initiated',
	Answered = 'Answered',
	Hangup = 'Hangup',
}

@Entity('call')
export class CallEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	name: string;

	@Column({
		type: 'enum',
		enum: CallStatus,
	})
	status: CallStatus;

	@Column({
		type: 'timestamp',
		nullable: true,
		name: 'answered_at',
	})
	answeredAt?: Date;

	@Column({
		type: 'timestamp',
		nullable: true,
		name: 'hungup_at',
	})
	hungupdAt?: Date;

	@ManyToOne(() => IncidentEntity, incident => incident.calls, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'incident_id' })
	incident: IncidentEntity;

	@RelationId((call: CallEntity) => call.incident)
	@Column({
		nullable: false,
		name: 'incident_id',
	})
	incidentId: number;

	@ManyToOne(() => UserEntity, user => user.calls, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@RelationId((call: CallEntity) => call.user)
	@Column({
		nullable: false,
		name: 'user_id',
	})
	userId: number;
}

import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	RelationId,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { RegionEntity } from './region.entity';
import { CommunityEntity } from './community.entity';
import { IncidentEntity } from './incident.entity';
import { CallEntity } from './call.entity';

export enum UserRole {
	Admin = 'Admin',
	RegionalAdmin = 'RegionalAdmin',
	CommunityAdmin = 'CommunityAdmin',
	Volunteer = 'Volunteer',
	Operator = 'Operator',
}

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: UserRole,
	})
	role: UserRole;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@Column({
		unique: true,
	})
	phone: string;

	@Column({
		unique: true,
	})
	email: string;

	@Column({
		name: 'first_name',
	})
	firstName: string;

	@Column({
		name: 'last_name',
	})
	lastName: string;

	@ManyToOne(() => RegionEntity, region => region.users, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'region_id' })
	region: RegionEntity;

	@RelationId((user: UserEntity) => user.region)
	@Column({
		nullable: false,
		name: 'region_id',
	})
	regionId: number;

	@ManyToOne(() => CommunityEntity, community => community.users, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'community_id' })
	community: CommunityEntity;

	@RelationId((user: UserEntity) => user.community)
	@Column({
		nullable: false,
		name: 'community_id',
	})
	communityId: number;

	@OneToMany(() => CallEntity, call => call.user, { cascade: true })
	calls: CallEntity[];
}

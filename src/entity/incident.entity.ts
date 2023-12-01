import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	RelationId,
} from 'typeorm';
import { CommunityEntity } from './community.entity';
import { RegionEntity } from './region.entity';
import { CallEntity } from './call.entity';

@Entity('incident')
export class IncidentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	address: string;

	@Column()
	description: string;

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date;

	@ManyToOne(() => RegionEntity, region => region.incidents, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'region_id' })
	region: RegionEntity;

	@RelationId((incident: IncidentEntity) => incident.region)
	@Column({
		nullable: false,
		name: 'region_id',
	})
	regionId: number;

	@ManyToOne(() => CommunityEntity, community => community.incidents, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'community_id' })
	community: CommunityEntity;

	@RelationId((incident: IncidentEntity) => incident.community)
	@Column({
		nullable: false,
		name: 'community_id',
	})
	communityId: number;

	@OneToMany(() => CallEntity, call => call.incident, { cascade: true })
	calls: CallEntity[];
}

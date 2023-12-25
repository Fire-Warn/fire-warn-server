import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId, OneToMany, JoinColumn } from 'typeorm';
import { RegionEntity } from './region.entity';
import { UserEntity } from './user.entity';
import { CommunityEntity } from './community.entity';
import { IncidentEntity } from './incident.entity';

@Entity('district')
export class DistrictEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	name: string;

	@ManyToOne(() => RegionEntity, region => region.districts, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'region_id' })
	region: RegionEntity;

	@RelationId((district: DistrictEntity) => district.region)
	@Column({
		nullable: false,
		name: 'region_id',
	})
	regionId: number;

	@OneToMany(() => CommunityEntity, community => community.region, { cascade: true })
	communities: CommunityEntity[];

	@OneToMany(() => UserEntity, user => user.district, { cascade: true })
	users: UserEntity[];

	@OneToMany(() => IncidentEntity, incident => incident.district, { cascade: true })
	incidents: IncidentEntity[];
}

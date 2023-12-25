import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId, OneToMany, JoinColumn } from 'typeorm';
import { RegionEntity } from './region.entity';
import { UserEntity } from './user.entity';
import { IncidentEntity } from './incident.entity';
import { DistrictEntity } from './district.entity';

@Entity('community')
export class CommunityEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	name: string;

	@ManyToOne(() => RegionEntity, region => region.communities, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'region_id' })
	region: RegionEntity;

	@RelationId((user: CommunityEntity) => user.region)
	@Column({
		nullable: false,
		name: 'region_id',
	})
	regionId: number;

	@ManyToOne(() => DistrictEntity, district => district.communities, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	@JoinColumn({ name: 'district_id' })
	district: DistrictEntity;

	@RelationId((community: CommunityEntity) => community.district)
	@Column({
		nullable: false,
		name: 'district_id',
	})
	districtId: number;

	@OneToMany(() => UserEntity, user => user.community, { cascade: true })
	users: UserEntity[];

	@OneToMany(() => IncidentEntity, incident => incident.community, { cascade: true })
	incidents: IncidentEntity[];
}

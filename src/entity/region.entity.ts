import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommunityEntity } from './community.entity';
import { UserEntity } from './user.entity';
import { IncidentEntity } from './incident.entity';
import { DistrictEntity } from './district.entity';

@Entity('region')
export class RegionEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	name: string;

	@OneToMany(() => DistrictEntity, district => district.region, { cascade: true })
	districts: DistrictEntity[];

	@OneToMany(() => CommunityEntity, community => community.region, { cascade: true })
	communities: CommunityEntity[];

	@OneToMany(() => UserEntity, user => user.region, { cascade: true })
	users: UserEntity[];

	@OneToMany(() => IncidentEntity, incident => incident.region, { cascade: true })
	incidents: IncidentEntity[];
}

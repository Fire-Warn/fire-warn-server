import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId, OneToMany, JoinColumn } from 'typeorm';
import { RegionEntity } from './region.entity';
import { UserEntity } from './user.entity';

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

	@OneToMany(() => UserEntity, user => user.community, { cascade: true })
	users: UserEntity[];
}

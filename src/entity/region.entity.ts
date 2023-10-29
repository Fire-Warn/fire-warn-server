import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommunityEntity } from './community.entity';
import { UserEntity } from './user.entity';

@Entity('region')
export class RegionEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	name: string;

	@OneToMany(() => CommunityEntity, community => community.region, { cascade: true })
	communities: CommunityEntity[];

	@OneToMany(() => UserEntity, user => user.region, { cascade: true })
	users: UserEntity[];
}

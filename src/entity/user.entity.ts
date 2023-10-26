import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Column,
} from 'typeorm';

export enum UserRole {
	Admin = 'Admin',
	Regular = 'Regular',
}

export enum UserStatus {
	Active = 'Active',
	Suspend = 'Suspend',
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
	email: string;

	@Column({
		name: 'first_name',
	})
	firstName: string;

	@Column({
		name: 'last_name',
	})
	lastName: string;
}

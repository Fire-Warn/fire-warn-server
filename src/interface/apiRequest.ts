import { IsEnum } from 'class-validator';
import { ApiProperty } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';

export enum Order {
	Asc = 'ASC',
	Desc = 'DESC',
}

export class RegisterUserRequest {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@IsEnum(UserRole)
	@ApiProperty({ enum: UserRole })
	role: UserRole;

	@ApiProperty()
	regionId: number;

	@ApiProperty()
	districtId: number;

	@ApiProperty()
	communityId: number;
}

export class CreateUserRequest {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty({ enum: UserRole, enumName: 'UserRole' })
	role: UserRole;

	@ApiProperty()
	regionId: number;

	@ApiProperty({ required: false })
	districtId?: number;

	@ApiProperty({ required: false })
	communityId?: number;
}

export enum UserListOrderBy {
	FirstName = 'user.first_name',
	LastName = 'user.last_name',
	CreatedAt = 'user.created_at',
	Role = 'user.role',
}

export enum IncidentListOrderBy {
	CreatedAt = 'incident.created_at',
}

export class CreateIncidentRequest {
	@ApiProperty()
	address: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	communityId: number;
}

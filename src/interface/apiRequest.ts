import { IsEnum } from 'class-validator';
import { ApiProperty } from 'shared/decorator';
import {UserRole} from "entity/user.entity";

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

	@IsEnum(UserRole)
	@ApiProperty({ enum: UserRole })
	role: UserRole;
}

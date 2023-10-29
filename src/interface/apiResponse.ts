import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'entity/user.entity';

export class UserResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	email: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty({ enum: UserRole, enumName: 'UserRole' })
	role: UserRole;
}

export class ListResponse {
	@ApiProperty()
	page: number;

	@ApiProperty()
	rowsPerPage: number;

	@ApiProperty()
	total: number;
}

export class UserListResponse extends ListResponse {
	@ApiProperty({ isArray: true, type: UserResponse })
	list: Array<UserResponse>;
}

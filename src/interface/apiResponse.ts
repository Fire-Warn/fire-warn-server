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

	@ApiProperty()
	phone: string;

	@ApiProperty()
	regionId: number;

	@ApiProperty()
	communityId: number;
}

export class CommunityResponse {
	@ApiProperty()
	name: string;

	@ApiProperty()
	regionId: number;

	@ApiProperty()
	id: number;
}

export class RegionResponse {
	@ApiProperty()
	name: string;

	@ApiProperty()
	id: number;
}

export class ListResponse {
	@ApiProperty()
	page: number;

	@ApiProperty()
	rowsPerPage: number;

	@ApiProperty()
	total: number;
}

export class UserListItemResponse extends UserResponse {
	@ApiProperty({ type: CommunityResponse })
	community: CommunityResponse;

	@ApiProperty({ type: RegionResponse })
	region: RegionResponse;
}

export class UserListResponse extends ListResponse {
	@ApiProperty({ isArray: true, type: UserListItemResponse })
	list: Array<UserListItemResponse>;
}

export class RegionListResponse {
	@ApiProperty({ isArray: true, type: RegionResponse })
	list: Array<RegionResponse>;
}

export class CommunityListResponse {
	@ApiProperty({ isArray: true, type: CommunityResponse })
	list: Array<CommunityResponse>;
}

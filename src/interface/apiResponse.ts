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

	@ApiProperty({ nullable: true })
	districtId?: number;

	@ApiProperty({ nullable: true })
	communityId?: number;
}

export class CommunityResponse {
	@ApiProperty()
	name: string;

	@ApiProperty()
	regionId: number;

	@ApiProperty()
	districtId: number;

	@ApiProperty()
	id: number;
}

export class DistrictResponse {
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
	@ApiProperty({ type: CommunityResponse, nullable: true })
	community?: CommunityResponse;

	@ApiProperty({ type: DistrictResponse, nullable: true })
	district?: DistrictResponse;

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

export class DistrictListResponse {
	@ApiProperty({ isArray: true, type: DistrictResponse })
	list: Array<DistrictResponse>;
}

export class IncidentResponse {
	@ApiProperty()
	address: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	regionId: number;

	@ApiProperty()
	districtId: number;

	@ApiProperty()
	communityId: number;

	@ApiProperty()
	id: number;

	@ApiProperty()
	createdAt: Date;
}

export class IncidentListItemResponse extends IncidentResponse {
	@ApiProperty({ type: CommunityResponse })
	community: CommunityResponse;

	@ApiProperty({ type: RegionResponse })
	region: RegionResponse;

	@ApiProperty({ type: DistrictResponse })
	district: DistrictResponse;
}

export class IncidentListResponse extends ListResponse {
	@ApiProperty({ isArray: true, type: IncidentListItemResponse })
	list: Array<IncidentListItemResponse>;
}

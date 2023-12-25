import { Injectable } from '@nestjs/common';

import { UserListResponse, UserResponse } from 'interface/apiResponse';
import { User } from 'model';
import { LocalityFormatter } from 'service/locality';
import { PaginationResponse } from 'value_object';
import { UserPaginationItem } from './user.service';

@Injectable()
export class UserFormatter {
	constructor(private readonly localityFormatter: LocalityFormatter) {}
	public toUserResponse(user: User): UserResponse {
		return {
			id: user.id,
			email: user.email,
			phone: user.phone,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			regionId: user.regionId,
			districtId: user.districtId,
			communityId: user.communityId,
		};
	}

	public toUserListResponse(userPaginationResponse: PaginationResponse<UserPaginationItem>): UserListResponse {
		return {
			list: userPaginationResponse.list.map(({ user, region, district, community }) => {
				return {
					...this.toUserResponse(user),
					region: this.localityFormatter.toRegionResponse(region),
					district: district && this.localityFormatter.toDistrictResponse(district),
					community: community && this.localityFormatter.toCommunityResponse(community),
				};
			}),
			page: userPaginationResponse.page,
			rowsPerPage: userPaginationResponse.rowsPerPage,
			total: userPaginationResponse.total,
		};
	}
}

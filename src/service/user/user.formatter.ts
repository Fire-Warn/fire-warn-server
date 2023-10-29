import { Injectable } from '@nestjs/common';

import { UserListResponse, UserResponse } from 'interface/apiResponse';
import { User } from 'model';
import { PaginationResponse } from 'value_object';

@Injectable()
export class UserFormatter {
	public toUserResponse(user: User): UserResponse {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
		};
	}

	public toUserListResponse(userPaginationResponse: PaginationResponse<User>): UserListResponse {
		return {
			list: userPaginationResponse.list.map(user => this.toUserResponse(user)),
			page: userPaginationResponse.page,
			rowsPerPage: userPaginationResponse.rowsPerPage,
			total: userPaginationResponse.total,
		};
	}
}

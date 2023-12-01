import { Body, Controller, Get, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserRequest, Order, UserListOrderBy } from 'interface/apiRequest';
import { UserListResponse, UserResponse } from 'interface/apiResponse';
import { UserFormatter, UserService } from 'service/user';
import { Auth, RequestingUser } from 'shared/decorator';
import { User } from 'model';
import { UserRole } from 'entity/user.entity';
import { UserPaginationRequest } from 'value_object/pagination_request';
import { PermissionsService } from 'service/permissions';

@Controller('users')
@ApiTags('User')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly userFormatter: UserFormatter,
		private readonly permissionsService: PermissionsService,
	) {}

	// @Post('/register')
	// @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	// public async register(@Body() body: RegisterUserRequest): Promise<UserResponse> {
	// 	await this.authService.ensureCognitoAccountExists(body.email);
	//
	// 	const user = await this.userService.registerUser(body);
	//
	// 	return this.userFormatter.toUserResponse(user);
	// }

	@Post('')
	@Auth(UserRole.Admin, UserRole.RegionalAdmin, UserRole.CommunityAdmin)
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async createUser(@Body() body: CreateUserRequest, @RequestingUser() currentUser: User): Promise<UserResponse> {
		this.permissionsService.ensureCanManageUser(currentUser, {
			role: body.role,
			regionId: body.regionId,
			communityId: body.communityId,
		});

		const user = await this.userService.createUser(body);

		return this.userFormatter.toUserResponse(user);
	}

	@Get('/current')
	@Auth()
	@ApiResponse({ status: HttpStatus.OK, type: UserResponse })
	public async getCurrent(@RequestingUser() user: User): Promise<UserResponse> {
		return this.userFormatter.toUserResponse(user);
	}

	@Get()
	@Auth(UserRole.Admin, UserRole.RegionalAdmin, UserRole.CommunityAdmin)
	@ApiQuery({ name: 'page', type: Number })
	@ApiQuery({ name: 'rowsPerPage', type: Number })
	@ApiQuery({ name: 'order', enum: Order, required: false, enumName: 'Order' })
	@ApiQuery({ name: 'orderBy', enum: UserListOrderBy, required: false, enumName: 'UserListOrderBy', type: String })
	@ApiQuery({ name: 'filters', isArray: true, type: String, required: false })
	@ApiResponse({ status: HttpStatus.OK, type: UserListResponse })
	public async getAllUsers(
		@Query('page', ParseIntPipe) page: number,
		@Query('rowsPerPage', ParseIntPipe) rowsPerPage: number,
		@Query('order') order: Order = Order.Desc,
		@Query('orderBy') orderBy: UserListOrderBy = UserListOrderBy.CreatedAt,
		@Query('filters') filters: string | Array<string> = [],
	): Promise<UserListResponse> {
		const paginationRequest = new UserPaginationRequest(
			page,
			rowsPerPage,
			Array.isArray(filters) ? filters : [filters],
			order,
			orderBy,
		);

		const result = await this.userService.getAllUsers(paginationRequest);

		return this.userFormatter.toUserListResponse(result);
	}
}

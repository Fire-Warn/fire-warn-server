import { Injectable } from '@nestjs/common';
import { generate } from 'generate-password';

import { UserRepository } from 'repository';
import { Community, District, Region, User } from 'model';
import { AuthService } from 'service/auth';
import { LocalityService } from 'service/locality';
import { CreateUserRequest, RegisterUserRequest } from 'interface/apiRequest';
import { UserRole } from 'entity/user.entity';
import { Result } from 'shared/util/util';
import { ApplicationError } from 'shared/error';
import { UserPaginationRequest } from 'value_object/pagination_request';
import { PaginationResponse } from 'value_object';

export interface UserPaginationItem {
	user: User;
	region: Region;
	district?: District;
	community?: Community;
}

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly authService: AuthService,
		private readonly localityService: LocalityService,
	) {}

	public async getById(id: number): Promise<User> {
		const user = await this.userRepository.getById(id);

		if (!user) {
			throw new UserNotFoundError();
		}

		return user;
	}

	public async getByEmail(email: string): Promise<User> {
		const user = await this.userRepository.getByEmail(email);

		if (!user) {
			throw new UserNotFoundByEmailError();
		}

		return user;
	}

	public async ensureUserNotExistByEmail(email: string): Promise<void> {
		const userExists = await this.userRepository.checkUserExistsByEmail(email);

		if (userExists) {
			throw new UserAlreadyExistsError();
		}
	}

	public async ensureUserNotExistByPhone(phone: string): Promise<void> {
		const userExists = await this.userRepository.checkUserExistsByPhone(phone);

		if (userExists) {
			throw new UserAlreadyExistsError();
		}
	}

	public async getUserByToken(token: string): Promise<User> {
		const account = await this.authService.getCognitoAccount(token);
		const userEmail: Result<string> = account.UserAttributes?.find(attribute => attribute.Name === 'email')?.Value;
		if (!userEmail) {
			throw new ApplicationError();
		}

		return await this.getByEmail(userEmail);
	}

	public async registerUser(body: RegisterUserRequest): Promise<User> {
		let user = new User(
			body.email,
			body.phone,
			body.firstName,
			body.lastName,
			UserRole.Volunteer,
			body.regionId,
			body.districtId,
			body.communityId,
		);

		await this.ensureUserNotExistByEmail(user.email);

		user = await this.userRepository.insertUser(user);

		// that's necessary to define user role using token
		const attributes = { [AuthService.userIdAttributeName]: user.id.toString() };
		await this.authService.updateAccountAttributes(user.email, attributes);

		return user;
	}

	public async getUsersByRolesAndCommunityId(roles: Array<UserRole>, communityId: number): Promise<Array<User>> {
		return this.userRepository.getUsersByRolesAndCommunityId(roles, communityId);
	}

	public generatePassword(): string {
		return generate({
			length: 12,
			numbers: true,
			uppercase: true,
			lowercase: true,
			strict: true,
		});
	}

	public async createUser(body: CreateUserRequest): Promise<User> {
		await this.ensureUserNotExistByEmail(body.email);
		await this.ensureUserNotExistByPhone(body.phone);

		if (body.role !== 'Volunteer') {
			await this.authService.createAccount(body.email);
		}

		let user = new User(
			body.email,
			body.phone,
			body.firstName,
			body.lastName,
			body.role,
			body.regionId,
			body.districtId,
			body.communityId,
		);

		user = await this.userRepository.insertUser(user);

		return user;
	}

	public async getAllUsers(
		paginationRequest: UserPaginationRequest,
		user: User,
	): Promise<PaginationResponse<UserPaginationItem>> {
		if (user.is(UserRole.RegionalAdmin)) {
			paginationRequest.filters.push({ key: 'user.region_id', value: user.regionId.toString() });
		} else if (user.is(UserRole.CommunityAdmin)) {
			paginationRequest.filters.push({ key: 'user.community_id', value: `${user.communityId}` });
		}

		const userPaginationResponse = await this.userRepository.getAllUsers(paginationRequest);

		const regionIds = Array.from(new Set(userPaginationResponse.list.map(u => u.regionId)));
		const communityIds = Array.from(
			new Set(
				userPaginationResponse.list.map(u => u.communityId).filter(communityId => !!communityId) as Array<number>,
			),
		);

		const regions = await this.localityService.getRegionByIds(regionIds);
		const communities = await this.localityService.getCommunityByIds(communityIds);

		return new PaginationResponse<UserPaginationItem>(
			paginationRequest.page,
			paginationRequest.rowsPerPage,
			userPaginationResponse.total,
			userPaginationResponse.list.map(user => {
				const region = regions.find(r => r.id === user.regionId) as Region;
				const community = communities.find(c => c.id === user.communityId) as Community;

				return {
					user,
					region,
					community,
				};
			}),
		);
	}
}

export class UserNotFoundError extends ApplicationError {}
export class UserAlreadyExistsError extends ApplicationError {}
export class UserNotFoundByEmailError extends ApplicationError {}

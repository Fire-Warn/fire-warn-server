import { Injectable } from '@nestjs/common';
import { generate } from 'generate-password';

import { UserRepository } from 'repository';
import { User } from 'model';
import { AuthService } from 'service/auth';
import { CreateUserRequest, RegisterUserRequest } from 'interface/apiRequest';
import { UserRole } from 'entity/user.entity';
import { Result } from 'shared/util/util';
import { ApplicationError } from 'shared/error';
import { UserPaginationRequest } from 'value_object/pagination_request';
import { PaginationResponse } from 'value_object';

export interface UserRestrictionFields {
	role: UserRole;
	regionId: number;
	communityId: number;
}

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly authService: AuthService,
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
			body.communityId,
		);

		await this.ensureUserNotExistByEmail(user.email);

		user = await this.userRepository.insertUser(user);

		// that's necessary to define user role using token
		const attributes = { [AuthService.userIdAttributeName]: user.id.toString() };
		await this.authService.updateAccountAttributes(user.email, attributes);

		return user;
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

	public ensureCanManageUser(currentUser: User, managedUser: UserRestrictionFields): void {
		switch (currentUser.role) {
			case UserRole.Admin:
				if (managedUser.role === UserRole.Admin) {
					throw new MissingRolePermissionsError();
				}
				break;
			case UserRole.RegionalAdmin:
				if (
					[UserRole.Admin, UserRole.RegionalAdmin].includes(managedUser.role) ||
					([UserRole.CommunityAdmin || UserRole.Volunteer].includes(managedUser.role) &&
						currentUser.regionId !== managedUser.regionId)
				) {
					throw new MissingRolePermissionsError();
				}
				break;
			case UserRole.CommunityAdmin:
				if (
					[UserRole.Admin, UserRole.RegionalAdmin, UserRole.CommunityAdmin].includes(managedUser.role) ||
					(managedUser.role === UserRole.Volunteer && currentUser.regionId !== managedUser.regionId)
				) {
					throw new MissingRolePermissionsError();
				}
				break;
			case UserRole.Volunteer:
				// Volunteer can't manage any users
				throw new MissingRolePermissionsError();
		}
	}

	public async createUser(body: CreateUserRequest): Promise<User> {
		await this.ensureUserNotExistByEmail(body.email);

		await this.authService.createAccount(body.email);
		let user = new User(
			body.email,
			body.phone,
			body.firstName,
			body.lastName,
			body.role,
			body.regionId,
			body.communityId,
		);

		user = await this.userRepository.insertUser(user);

		return user;
	}

	public async getAllUsers(paginationRequest: UserPaginationRequest): Promise<PaginationResponse<User>> {
		const userPaginationResponse = await this.userRepository.getAllUsers(paginationRequest);

		return new PaginationResponse<User>(
			paginationRequest.page,
			paginationRequest.rowsPerPage,
			userPaginationResponse.total,
			userPaginationResponse.list,
		);
	}
}

export class UserNotFoundError extends ApplicationError {}
export class UserAlreadyExistsError extends ApplicationError {}
export class MissingRolePermissionsError extends ApplicationError {}
export class UserNotFoundByEmailError extends ApplicationError {}

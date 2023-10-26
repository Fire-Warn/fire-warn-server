import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { UserEntity } from 'entity/user.entity';
import { User } from 'model';
import { Result } from 'shared/util/util';

@Injectable()
export class UserRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<User>> {
		const userEntity = await this.manager
			.createQueryBuilder(UserEntity, 'user')
			.where('user.id = :id', { id })
			.getOne();

		return this.convertToModel(userEntity);
	}

	public async checkUserExistsByEmail(email: string): Promise<boolean> {
		const count = await this.manager.createQueryBuilder(UserEntity, 'userIdentity').where({ email }).getCount();

		return count > 0;
	}

	public async insertUser(user: User): Promise<User> {
		const { raw } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(UserEntity)
			.values({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			})
			.execute();

		return (await this.getById(raw[0].id)) as User;
	}

	public convertToModel(userEntity?: UserEntity): Result<User> {
		if (userEntity) {
			return new User(
				userEntity.email,
				userEntity.firstName,
				userEntity.lastName,
				userEntity.role,
				userEntity.id,
			);
		}
	}
}

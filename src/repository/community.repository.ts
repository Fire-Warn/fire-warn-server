import { EntityManager, In } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Community } from 'model';
import { Result } from 'shared/util/util';
import { CommunityEntity } from 'entity/community.entity';

@Injectable()
export class CommunityRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<Community>> {
		const communityEntity = await this.manager
			.createQueryBuilder(CommunityEntity, 'community')
			.where('community.id = :id', { id })
			.getOne();

		return this.convertToModel(communityEntity);
	}

	public async getByIds(ids: Array<number>): Promise<Array<Community>> {
		const communityEntities = await this.manager
			.createQueryBuilder(CommunityEntity, 'community')
			.where({ id: In(ids) })
			.getMany();

		return communityEntities.map(communityEntity => this.convertToModel(communityEntity) as Community);
	}

	public async getByRegionId(regionId: number): Promise<Array<Community>> {
		const communityEntities = await this.manager.find(CommunityEntity, { where: { regionId } });

		return communityEntities.map(communityEntity => this.convertToModel(communityEntity) as Community);
	}

	public convertToModel(communityEntity?: CommunityEntity): Result<Community> {
		if (communityEntity) {
			return new Community(communityEntity.name, communityEntity.regionId, communityEntity.id);
		}
	}
}

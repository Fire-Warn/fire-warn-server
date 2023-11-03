import { EntityManager, In } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Region } from 'model';
import { Result } from 'shared/util/util';
import { RegionEntity } from 'entity/region.entity';

@Injectable()
export class RegionRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<Region>> {
		const regionEntity = await this.manager
			.createQueryBuilder(RegionEntity, 'region')
			.where('region.id = :id', { id })
			.getOne();

		return this.convertToModel(regionEntity);
	}

	public async getByIds(ids: Array<number>): Promise<Array<Region>> {
		const regionEntities = await this.manager
			.createQueryBuilder(RegionEntity, 'region')
			.where({ id: In(ids) })
			.getMany();

		return regionEntities.map(regionEntity => this.convertToModel(regionEntity) as Region);
	}

	public async getAll(): Promise<Array<Region>> {
		const regionEntities = await this.manager.find(RegionEntity);

		return regionEntities.map(regionEntity => this.convertToModel(regionEntity) as Region);
	}

	public convertToModel(regionEntity?: RegionEntity): Result<Region> {
		if (regionEntity) {
			return new Region(regionEntity.name, regionEntity.id);
		}
	}
}

import { EntityManager, In } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { District } from 'model';
import { Result } from 'shared/util/util';
import { DistrictEntity } from 'entity/district.entity';

@Injectable()
export class DistrictRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<District>> {
		const districtEntity = await this.manager
			.createQueryBuilder(DistrictEntity, 'district')
			.where('district.id = :id', { id })
			.getOne();

		return this.convertToModel(districtEntity);
	}

	public async getByIds(ids: Array<number>): Promise<Array<District>> {
		const districtEntities = await this.manager
			.createQueryBuilder(DistrictEntity, 'district')
			.where({ id: In(ids) })
			.getMany();

		return districtEntities.map(districtEntity => this.convertToModel(districtEntity) as District);
	}

	public async getByRegionId(regionId: number): Promise<Array<District>> {
		const districtEntities = await this.manager.find(DistrictEntity, { where: { regionId } });

		return districtEntities.map(districtEntity => this.convertToModel(districtEntity) as District);
	}

	public convertToModel(districtEntity?: DistrictEntity): Result<District> {
		if (districtEntity) {
			return new District(districtEntity.name, districtEntity.regionId, districtEntity.id);
		}
	}
}

import { Injectable } from '@nestjs/common';

import { Community, Region } from 'model';
import { ApplicationError } from 'shared/error';
import { RegionRepository, CommunityRepository } from 'repository';

@Injectable()
export class LocalityService {
	constructor(
		private readonly regionRepository: RegionRepository,
		private readonly communityRepository: CommunityRepository,
	) {}

	public async getRegionById(id: number): Promise<Region> {
		const region = await this.regionRepository.getById(id);

		if (!region) {
			throw new RegionNotExistsError();
		}

		return region;
	}

	public async getRegionByIds(ids: Array<number>): Promise<Array<Region>> {
		const regions = await this.regionRepository.getByIds(ids);

		if (regions.length !== ids.length) {
			throw new NotAllRegionsExistsError();
		}

		return regions;
	}

	public async getCommunityByIds(ids: Array<number>): Promise<Array<Community>> {
		const communities = await this.communityRepository.getByIds(ids);

		if (communities.length !== ids.length) {
			throw new NotAllCommunitiesExistsError();
		}

		return communities;
	}

	public async getAllRegions(): Promise<Array<Region>> {
		return this.regionRepository.getAll();
	}

	public async getRegionCommunities(region: Region): Promise<Array<Community>> {
		return this.communityRepository.getByRegionId(region.id);
	}
}

export class NotAllRegionsExistsError extends ApplicationError {}
export class NotAllCommunitiesExistsError extends ApplicationError {}
export class RegionNotExistsError extends ApplicationError {}

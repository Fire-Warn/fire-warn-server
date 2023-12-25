import { Injectable } from '@nestjs/common';

import { Community, District, Region } from 'model';
import { ApplicationError } from 'shared/error';
import { RegionRepository, CommunityRepository, DistrictRepository } from 'repository';

@Injectable()
export class LocalityService {
	constructor(
		private readonly regionRepository: RegionRepository,
		private readonly communityRepository: CommunityRepository,
		private readonly districtRepository: DistrictRepository,
	) {}

	public async getRegionById(id: number): Promise<Region> {
		const region = await this.regionRepository.getById(id);

		if (!region) {
			throw new RegionNotExistsError();
		}

		return region;
	}

	public async getDistrictById(id: number): Promise<District> {
		const district = await this.districtRepository.getById(id);

		if (!district) {
			throw new DistrictNotExistsError();
		}

		return district;
	}

	public async getCommunityById(id: number): Promise<Community> {
		const community = await this.communityRepository.getById(id);

		if (!community) {
			throw new CommunityNotExistsError();
		}

		return community;
	}

	public async getRegionByIds(ids: Array<number>): Promise<Array<Region>> {
		const regions = await this.regionRepository.getByIds(ids);

		if (regions.length !== ids.length) {
			throw new NotAllRegionsExistsError();
		}

		return regions;
	}

	public async getDistrictsByIds(ids: Array<number>): Promise<Array<District>> {
		const districts = await this.districtRepository.getByIds(ids);

		if (districts.length !== ids.length) {
			throw new NotAllDistrictsExistsError();
		}

		return districts;
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

	public async getRegionDistricts(region: Region): Promise<Array<District>> {
		return this.districtRepository.getByRegionId(region.id);
	}

	public async getRegionCommunities(region: Region): Promise<Array<Community>> {
		return this.communityRepository.getByRegionId(region.id);
	}

	public async getDistrictCommunities(district: District): Promise<Array<Community>> {
		return this.communityRepository.getByDistrictId(district.id);
	}
}

export class NotAllRegionsExistsError extends ApplicationError {}
export class NotAllDistrictsExistsError extends ApplicationError {}
export class NotAllCommunitiesExistsError extends ApplicationError {}
export class RegionNotExistsError extends ApplicationError {}
export class DistrictNotExistsError extends ApplicationError {}
export class CommunityNotExistsError extends ApplicationError {}

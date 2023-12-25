import { Controller, Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommunityListResponse, DistrictListResponse, RegionListResponse } from 'interface/apiResponse';
import { LocalityFormatter, LocalityService } from 'service/locality';

@Controller('locality')
@ApiTags('Locality')
export class LocalityController {
	constructor(
		private readonly localityService: LocalityService,
		private readonly localityFormatter: LocalityFormatter,
	) {}

	@Get('/regions')
	@ApiResponse({ status: HttpStatus.OK, type: RegionListResponse })
	public async getAllRegions(): Promise<RegionListResponse> {
		const regions = await this.localityService.getAllRegions();

		return {
			list: regions.map(region => this.localityFormatter.toRegionResponse(region)),
		};
	}

	@Get('/regions/:id/districts')
	@ApiResponse({ status: HttpStatus.OK, type: DistrictListResponse })
	public async getRegionDistricts(@Param('id', ParseIntPipe) id: number): Promise<DistrictListResponse> {
		const region = await this.localityService.getRegionById(id);
		const districts = await this.localityService.getRegionDistricts(region);

		return {
			list: districts.map(district => this.localityFormatter.toDistrictResponse(district)),
		};
	}

	@Get('/regions/:id/communities')
	@ApiResponse({ status: HttpStatus.OK, type: CommunityListResponse })
	public async getRegionCommunities(@Param('id', ParseIntPipe) id: number): Promise<CommunityListResponse> {
		const region = await this.localityService.getRegionById(id);
		const communities = await this.localityService.getRegionCommunities(region);

		return {
			list: communities.map(community => this.localityFormatter.toCommunityResponse(community)),
		};
	}

	@Get('/districts/:id/communities')
	@ApiResponse({ status: HttpStatus.OK, type: CommunityListResponse })
	public async getDistrictCommunities(@Param('id', ParseIntPipe) id: number): Promise<CommunityListResponse> {
		const district = await this.localityService.getDistrictById(id);
		const communities = await this.localityService.getDistrictCommunities(district);

		return {
			list: communities.map(community => this.localityFormatter.toCommunityResponse(community)),
		};
	}
}

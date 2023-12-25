import { Injectable } from '@nestjs/common';

import { Community, District, Region } from 'model';
import { CommunityResponse, DistrictResponse, RegionResponse } from 'interface/apiResponse';

@Injectable()
export class LocalityFormatter {
	public toRegionResponse(region: Region): RegionResponse {
		return {
			id: region.id,
			name: region.name,
		};
	}

	public toDistrictResponse(district: District): DistrictResponse {
		return {
			id: district.id,
			name: district.name,
			regionId: district.regionId,
		};
	}

	public toCommunityResponse(community: Community): CommunityResponse {
		return {
			id: community.id,
			name: community.name,
			regionId: community.regionId,
			districtId: community.districtId,
		};
	}
}

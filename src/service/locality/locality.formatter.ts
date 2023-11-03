import { Injectable } from '@nestjs/common';

import { Community, Region } from 'model';
import { CommunityResponse, RegionResponse } from 'interface/apiResponse';

@Injectable()
export class LocalityFormatter {
	public toRegionResponse(region: Region): RegionResponse {
		return {
			id: region.id,
			name: region.name,
		};
	}

	public toCommunityResponse(community: Community): CommunityResponse {
		return {
			id: community.id,
			name: community.name,
			regionId: community.regionId,
		};
	}
}

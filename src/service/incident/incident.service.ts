import { Injectable } from '@nestjs/common';

import { UniTalkService } from 'service/unitalk';
import { PaginationResponse } from 'value_object';
import { IncidentPaginationRequest } from 'value_object/pagination_request';
import { Incident, Community, Region } from 'model';
import { IncidentRepository } from 'repository';
import { LocalityService } from '../locality';

export interface IncidentPaginationItem {
	incident: Incident;
	region: Region;
	community: Community;
}

@Injectable()
export class IncidentService {
	constructor(
		private readonly uniTalkService: UniTalkService,
		private readonly incidentRepository: IncidentRepository,
		private readonly localityService: LocalityService,
	) {}

	public async getAllIncidents(
		paginationRequest: IncidentPaginationRequest,
	): Promise<PaginationResponse<IncidentPaginationItem>> {
		const incidentPaginationResponse = await this.incidentRepository.getAllIncidents(paginationRequest);

		const regionIds = Array.from(new Set(incidentPaginationResponse.list.map(u => u.regionId)));
		const communityIds = Array.from(new Set(incidentPaginationResponse.list.map(u => u.communityId)));

		const regions = await this.localityService.getRegionByIds(regionIds);
		const communities = await this.localityService.getCommunityByIds(communityIds);

		return new PaginationResponse<IncidentPaginationItem>(
			paginationRequest.page,
			paginationRequest.rowsPerPage,
			incidentPaginationResponse.total,
			incidentPaginationResponse.list.map(incident => {
				const region = regions.find(r => r.id === incident.regionId) as Region;
				const community = communities.find(c => c.id === incident.communityId) as Community;

				return {
					incident,
					region,
					community,
				};
			}),
		);
	}
}

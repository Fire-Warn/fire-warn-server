import { Injectable } from '@nestjs/common';

import { PaginationResponse } from 'value_object';
import { IncidentPaginationRequest } from 'value_object/pagination_request';
import { Incident, Community, Region, User } from 'model';
import { IncidentRepository } from 'repository';
import { LocalityService } from 'service/locality';
import { CreateIncidentRequest } from 'interface/apiRequest';

export interface IncidentPaginationItem {
	incident: Incident;
	region: Region;
	community: Community;
}

@Injectable()
export class IncidentService {
	constructor(
		private readonly incidentRepository: IncidentRepository,
		private readonly localityService: LocalityService,
	) {}

	public async createIncident(body: CreateIncidentRequest, user: User): Promise<Incident> {
		const incident = new Incident(body.address, body.description, user.regionId, user.communityId, user.id);

		return this.incidentRepository.insertIncident(incident);
	}

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

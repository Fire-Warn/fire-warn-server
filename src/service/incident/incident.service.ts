import { Injectable } from '@nestjs/common';

import { PaginationResponse } from 'value_object';
import { IncidentPaginationRequest } from 'value_object/pagination_request';
import { Incident, Community, Region, User, District } from 'model';
import { IncidentRepository } from 'repository';
import { LocalityService } from 'service/locality';
import { CreateIncidentRequest } from 'interface/apiRequest';

export interface IncidentPaginationItem {
	incident: Incident;
	region: Region;
	district: District;
	community: Community;
}

@Injectable()
export class IncidentService {
	constructor(
		private readonly incidentRepository: IncidentRepository,
		private readonly localityService: LocalityService,
	) {}

	public async createIncident(body: CreateIncidentRequest, user: User): Promise<Incident> {
		const community = await this.localityService.getCommunityById(body.communityId);
		const incident = new Incident(
			body.address,
			body.description,
			community.regionId,
			community.districtId,
			community.id,
			user.id,
		);

		return this.incidentRepository.insertIncident(incident);
	}

	public async getAllIncidents(
		paginationRequest: IncidentPaginationRequest,
	): Promise<PaginationResponse<IncidentPaginationItem>> {
		const incidentPaginationResponse = await this.incidentRepository.getAllIncidents(paginationRequest);

		const regionIds = Array.from(new Set(incidentPaginationResponse.list.map(u => u.regionId)));
		const districtIds = Array.from(new Set(incidentPaginationResponse.list.map(u => u.districtId)));
		const communityIds = Array.from(new Set(incidentPaginationResponse.list.map(u => u.communityId)));

		const regions = await this.localityService.getRegionByIds(regionIds);
		const districts = await this.localityService.getDistrictsByIds(districtIds);
		const communities = await this.localityService.getCommunityByIds(communityIds);

		return new PaginationResponse<IncidentPaginationItem>(
			paginationRequest.page,
			paginationRequest.rowsPerPage,
			incidentPaginationResponse.total,
			incidentPaginationResponse.list.map(incident => {
				const region = regions.find(r => r.id === incident.regionId) as Region;
				const district = districts.find(d => d.id === incident.districtId) as District;
				const community = communities.find(c => c.id === incident.communityId) as Community;

				return {
					incident,
					region,
					district,
					community,
				};
			}),
		);
	}
}

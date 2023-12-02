import { Injectable } from '@nestjs/common';
import { PaginationResponse } from '../../value_object';
import { IncidentPaginationItem } from 'service/incident/incident.service';
import { IncidentListResponse, IncidentResponse, UserListResponse } from '../../interface/apiResponse';
import { LocalityFormatter } from '../locality';
import { Incident } from '../../model';

@Injectable()
export class IncidentFormatter {
	constructor(private readonly localityFormatter: LocalityFormatter) {}

	public toIncidentResponse(incident: Incident): IncidentResponse {
		return {
			id: incident.id,
			address: incident.address,
			description: incident.description,
			regionId: incident.regionId,
			communityId: incident.communityId,
			createdAt: incident.createdAt,
		};
	}

	public toIncidentListResponse(
		incidentPaginationResponse: PaginationResponse<IncidentPaginationItem>,
	): IncidentListResponse {
		return {
			list: incidentPaginationResponse.list.map(({ incident, region, community }) => {
				return {
					...this.toIncidentResponse(incident),
					region: this.localityFormatter.toRegionResponse(region),
					community: this.localityFormatter.toCommunityResponse(community),
				};
			}),
			page: incidentPaginationResponse.page,
			rowsPerPage: incidentPaginationResponse.rowsPerPage,
			total: incidentPaginationResponse.total,
		};
	}
}

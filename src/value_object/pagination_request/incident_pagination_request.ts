import { PaginationRequest } from './pagination_request';
import { IncidentListOrderBy } from 'interface/apiRequest';

export enum IncidentFilterColumns {
	incidentRegion = 'incident.regionId',
	incidentCommunity = 'incident.communityId',
}

export class IncidentPaginationRequest extends PaginationRequest<IncidentListOrderBy> {
	protected get columnsToFilter() {
		return Object.values(IncidentFilterColumns);
	}
}

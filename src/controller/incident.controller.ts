import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
	CommunityListResponse,
	IncidentListResponse,
	RegionListResponse,
	UserListResponse,
} from 'interface/apiResponse';
import { IncidentService, IncidentFormatter } from 'service/incident';
import { Auth } from '../shared/decorator';
import { UserRole } from '../entity/user.entity';
import { IncidentListOrderBy, Order, UserListOrderBy } from '../interface/apiRequest';
import { IncidentPaginationRequest } from '../value_object/pagination_request/incident_pagination_request';

@Controller('incidents')
@ApiTags('Incident')
export class IncidentController {
	constructor(
		private readonly incidentService: IncidentService,
		private readonly incidentFormatter: IncidentFormatter,
	) {}

	@Get()
	@Auth(UserRole.Admin, UserRole.RegionalAdmin, UserRole.CommunityAdmin, UserRole.Operator)
	@ApiQuery({ name: 'page', type: Number })
	@ApiQuery({ name: 'rowsPerPage', type: Number })
	@ApiQuery({ name: 'order', enum: Order, required: false, enumName: 'Order' })
	@ApiQuery({
		name: 'orderBy',
		enum: IncidentListOrderBy,
		required: false,
		enumName: 'IncidentListOrderBy',
		type: String,
	})
	@ApiQuery({ name: 'filters', isArray: true, type: String, required: false })
	@ApiResponse({ status: HttpStatus.OK, type: IncidentListResponse })
	public async getAllUsers(
		@Query('page', ParseIntPipe) page: number,
		@Query('rowsPerPage', ParseIntPipe) rowsPerPage: number,
		@Query('order') order: Order = Order.Desc,
		@Query('orderBy') orderBy: IncidentListOrderBy = IncidentListOrderBy.CreatedAt,
		@Query('filters') filters: string | Array<string> = [],
	): Promise<IncidentListResponse> {
		const paginationRequest = new IncidentPaginationRequest(
			page,
			rowsPerPage,
			Array.isArray(filters) ? filters : [filters],
			order,
			orderBy,
		);

		const result = await this.incidentService.getAllIncidents(paginationRequest);

		return this.incidentFormatter.toIncidentListResponse(result);
	}
}

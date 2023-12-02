import { Body, Controller, Get, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IncidentListResponse, IncidentResponse } from 'interface/apiResponse';
import { IncidentFormatter, IncidentService } from 'service/incident';
import { Auth, RequestingUser } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';
import { CreateIncidentRequest, IncidentListOrderBy, Order } from 'interface/apiRequest';
import { IncidentPaginationRequest } from 'value_object/pagination_request';
import { User } from 'model';
import { PermissionsService } from 'service/permissions';

@Controller('incidents')
@ApiTags('Incident')
export class IncidentController {
	constructor(
		private readonly incidentService: IncidentService,
		private readonly incidentFormatter: IncidentFormatter,
		private readonly permissionsService: PermissionsService,
	) {}

	@Post('')
	@Auth(UserRole.Operator)
	@ApiResponse({ status: HttpStatus.OK, type: IncidentResponse })
	public async createIncident(
		@Body() body: CreateIncidentRequest,
		@RequestingUser() user: User,
	): Promise<IncidentResponse> {
		this.permissionsService.ensureCanManageIncident(user, { regionId: user.regionId, communityId: user.communityId });

		const incident = await this.incidentService.createIncident(body, user);

		return this.incidentFormatter.toIncidentResponse(incident);
	}

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
	public async getAllIncidents(
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

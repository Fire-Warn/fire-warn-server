import { Body, Controller, Get, HttpStatus, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { IncidentListResponse, IncidentResponse } from 'interface/apiResponse';
import { IncidentFormatter, IncidentService } from 'service/incident';
import { Auth, RequestingUser } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';
import { CreateIncidentRequest, IncidentListOrderBy, Order } from 'interface/apiRequest';
import { IncidentPaginationRequest } from 'value_object/pagination_request';
import { User } from 'model';
import { UserService } from 'service/user';
import { MessagingService } from 'service/messaging';
import { LocalityService } from 'service/locality';
import { PermissionsService } from 'service/permissions';

@Controller('incidents')
@ApiTags('Incident')
export class IncidentController {
	constructor(
		private readonly incidentService: IncidentService,
		private readonly incidentFormatter: IncidentFormatter,
		private readonly userService: UserService,
		private readonly messagingService: MessagingService,
		private readonly localityService: LocalityService,
		private readonly permissionsService: PermissionsService,
	) {}

	@Post('')
	@Auth(UserRole.Operator)
	@ApiResponse({ status: HttpStatus.OK, type: IncidentResponse })
	public async createIncident(
		@Body() body: CreateIncidentRequest,
		@RequestingUser() user: User,
	): Promise<IncidentResponse> {
		const community = await this.localityService.getCommunityById(body.communityId);
		this.permissionsService.ensureOperatorCanManageCommunityIncident(user, community);

		const incident = await this.incidentService.createIncident(body, user);

		const communityVolunteers = await this.userService.getUsersByRolesAndCommunityId(
			[UserRole.Volunteer],
			body.communityId,
		);

		// await this.messagingService.sendIncidentSMSs(incident, communityVolunteers);
		await this.messagingService.enqueueIncidentCalls(incident, communityVolunteers);

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

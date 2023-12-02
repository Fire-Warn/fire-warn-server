import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Incident } from 'model';
import { Result } from 'shared/util/util';
import { applyFilters, applyPaginationParams, ListWithTotal } from 'shared/util/typeorm';
import { IncidentPaginationRequest } from 'value_object/pagination_request';
import { IncidentEntity } from 'entity/incident.entity';

@Injectable()
export class IncidentRepository {
	constructor(private manager: EntityManager) {}

	public async getAllIncidents(paginationRequest: IncidentPaginationRequest): Promise<ListWithTotal<Incident>> {
		let incidentEntitiesQuery = this.manager.createQueryBuilder(IncidentEntity, 'incident');
		incidentEntitiesQuery = applyFilters(incidentEntitiesQuery, paginationRequest.filters);

		const total = await incidentEntitiesQuery.getCount();

		incidentEntitiesQuery = applyPaginationParams(incidentEntitiesQuery, paginationRequest);
		const incidentEntities = await incidentEntitiesQuery.getMany();

		return {
			list: incidentEntities.map(incidentEntity => this.convertToModel(incidentEntity)) as Array<Incident>,
			total,
		};
	}

	public async getById(id: number): Promise<Result<Incident>> {
		const incidentEntity = await this.manager
			.createQueryBuilder(IncidentEntity, 'incident')
			.where('incident.id = :id', { id })
			.getOne();

		return this.convertToModel(incidentEntity);
	}

	public async insertIncident(incident: Incident): Promise<Incident> {
		const { raw } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(IncidentEntity)
			.values({
				address: incident.address,
				description: incident.description,
				regionId: incident.regionId,
				communityId: incident.communityId,
				createdUserId: incident.createdUserId,
			})
			.execute();

		return (await this.getById(raw[0].id)) as Incident;
	}

	public convertToModel(incidentEntity?: IncidentEntity): Result<Incident> {
		if (incidentEntity) {
			return new Incident(
				incidentEntity.address,
				incidentEntity.description,
				incidentEntity.regionId,
				incidentEntity.communityId,
				incidentEntity.createdUserId,
				incidentEntity.id,
				incidentEntity.createdAt,
			);
		}
	}
}

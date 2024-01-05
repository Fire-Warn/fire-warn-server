import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Call } from 'model';
import { Result } from 'shared/util/util';
import { CallEntity, CallStatus, IvrInteraction } from 'entity/call.entity';

@Injectable()
export class CallRepository {
	constructor(private manager: EntityManager) {}

	public async getById(id: number): Promise<Result<Call>> {
		const callEntity = await this.manager
			.createQueryBuilder(CallEntity, 'call')
			.where('call.id = :id', { id })
			.getOne();

		return this.convertToModel(callEntity);
	}

	public async getByUserIdAndIncidentId(userId: number, incidentId: number): Promise<Result<Call>> {
		const callEntity = await this.manager
			.createQueryBuilder(CallEntity, 'call')
			.where('call.user_id = :userId', { userId })
			.andWhere('call.incident_id = :incidentId', { incidentId })
			.getOne();

		return this.convertToModel(callEntity);
	}

	public async insert(call: Call): Promise<Call> {
		const { raw } = await this.manager
			.createQueryBuilder()
			.insert()
			.into(CallEntity)
			.values({
				name: call.name,
				status: call.status,
				answeredAt: call.answeredAt,
				hungupdAt: call.hungupdAt,
				incidentId: call.incidentId,
				userId: call.userId,
			})
			.execute();

		return (await this.getById(raw[0].id)) as Call;
	}

	public async update(call: Call): Promise<Call> {
		await this.manager
			.createQueryBuilder()
			.update(CallEntity)
			.set({
				status: call.status,
				ivrInteraction: call.ivrInteraction,
				answeredAt: call.answeredAt,
				hungupdAt: call.hungupdAt,
			})
			.where({ id: call.id })
			.execute();

		return (await this.getById(call.id)) as Call;
	}

	public async setStatus(call: Call, status: CallStatus): Promise<Call> {
		await this.manager.createQueryBuilder().update(CallEntity).set({ status }).where({ id: call.id }).execute();

		return (await this.getById(call.id)) as Call;
	}

	public async setIvrInteraction(call: Call, ivrInteraction: IvrInteraction): Promise<Call> {
		await this.manager.createQueryBuilder().update(CallEntity).set({ ivrInteraction }).where({ id: call.id }).execute();

		return (await this.getById(call.id)) as Call;
	}

	public convertToModel(callEntity?: CallEntity): Result<Call> {
		if (callEntity) {
			return new Call(
				callEntity.name,
				callEntity.status,
				callEntity.ivrInteraction,
				callEntity.incidentId,
				callEntity.userId,
				callEntity.answeredAt,
				callEntity.hungupdAt,
				callEntity.id,
			);
		}
	}
}

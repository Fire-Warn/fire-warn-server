import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Call } from 'model';
import { Result } from 'shared/util/util';
import { CallEntity } from 'entity/call.entity';

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

	public convertToModel(callEntity?: CallEntity): Result<Call> {
		if (callEntity) {
			return new Call(
				callEntity.name,
				callEntity.status,
				callEntity.incidentId,
				callEntity.userId,
				callEntity.answeredAt,
				callEntity.hungupdAt,
				callEntity.id,
			);
		}
	}
}

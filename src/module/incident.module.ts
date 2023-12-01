import { Module } from '@nestjs/common';

import { IncidentController } from 'controller';
import { IncidentFormatter, IncidentService } from 'service/incident';
import { UniTalkService } from 'service/unitalk';
import { AuthModule } from './auth.module';

@Module({
	imports: [AuthModule],
	controllers: [IncidentController],
	providers: [IncidentService, IncidentFormatter, UniTalkService],
})
export class IncidentModule {}

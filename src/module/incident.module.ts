import { Module } from '@nestjs/common';

import { IncidentController } from 'controller';
import { IncidentFormatter, IncidentService } from 'service/incident';
import { UniTalkService } from 'service/unitalk';
import { AuthModule } from './auth.module';
import { PermissionsService } from 'service/permissions';
import {
	CallRepository,
	CommunityRepository,
	DistrictRepository,
	IncidentRepository,
	RegionRepository,
} from 'repository';
import { LocalityFormatter, LocalityService } from 'service/locality';
import { MessagingService } from 'service/messaging';

@Module({
	imports: [AuthModule],
	controllers: [IncidentController],
	providers: [
		IncidentService,
		IncidentFormatter,
		UniTalkService,
		PermissionsService,
		IncidentRepository,
		LocalityFormatter,
		MessagingService,
		CallRepository,
		LocalityService,
		RegionRepository,
		DistrictRepository,
		CommunityRepository,
	],
})
export class IncidentModule {}

import { Module } from '@nestjs/common';

import { IncidentController } from 'controller';
import { IncidentFormatter, IncidentService } from 'service/incident';
import { UnitalkService } from 'service/unitalk';
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
import { UserFormatter } from 'service/user';
import { CallService } from 'service/call';

@Module({
	imports: [AuthModule],
	controllers: [IncidentController],
	providers: [
		IncidentService,
		IncidentFormatter,
		UnitalkService,
		PermissionsService,
		IncidentRepository,
		LocalityFormatter,
		MessagingService,
		CallRepository,
		LocalityService,
		RegionRepository,
		DistrictRepository,
		CommunityRepository,
		UserFormatter,
		CallService,
	],
})
export class IncidentModule {}

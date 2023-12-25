import { Module } from '@nestjs/common';

import { LocalityController } from 'controller';
import { LocalityFormatter, LocalityService } from 'service/locality';
import { CommunityRepository, DistrictRepository, RegionRepository } from 'repository';

@Module({
	controllers: [LocalityController],
	providers: [LocalityService, LocalityFormatter, RegionRepository, DistrictRepository, CommunityRepository],
})
export class LocalityModule {}

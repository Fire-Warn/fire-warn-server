import { Module } from '@nestjs/common';

import { LocalityController } from 'controller';
import { LocalityFormatter, LocalityService } from 'service/locality';
import { CommunityRepository, RegionRepository } from 'repository';

@Module({
	controllers: [LocalityController],
	providers: [LocalityService, LocalityFormatter, RegionRepository, CommunityRepository],
})
export class LocalityModule {}

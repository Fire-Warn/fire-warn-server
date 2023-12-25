import { Module } from '@nestjs/common';

import { UserService } from 'service/user';
import { AuthService } from 'service/auth';
import { LocalityService } from 'service/locality';
import { CommunityRepository, DistrictRepository, RegionRepository, UserRepository } from 'repository';

@Module({
	providers: [
		UserService,
		AuthService,
		UserRepository,
		LocalityService,
		RegionRepository,
		DistrictRepository,
		CommunityRepository,
	],
	exports: [
		UserService,
		AuthService,
		UserRepository,
		LocalityService,
		RegionRepository,
		DistrictRepository,
		CommunityRepository,
	],
})
export class AuthModule {}

import { Module } from '@nestjs/common';

import { UserController } from 'controller';
import { AuthService } from 'service/auth';
import { UserService, UserFormatter } from 'service/user';
import { LocalityFormatter, LocalityService } from 'service/locality';
import { PermissionsService } from 'service/permissions';
import { CommunityRepository, RegionRepository, UserRepository } from 'repository';
import { AuthModule } from './auth.module';

@Module({
	imports: [AuthModule],
	controllers: [UserController],
	providers: [
		AuthService,
		UserRepository,
		UserService,
		UserFormatter,
		LocalityService,
		LocalityFormatter,
		RegionRepository,
		CommunityRepository,
		PermissionsService,
	],
})
export class UserModule {}

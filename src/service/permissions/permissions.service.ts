import { Community, User } from 'model';
import { UserRole } from 'entity/user.entity';
import { ApplicationError } from 'shared/error';

export interface UserRestrictionFields {
	role: UserRole;
	regionId: number;
	districtId?: number;
	communityId?: number;
}

export interface IncidentRestrictionFields {
	regionId: number;
	districtId: number;
	communityId: number;
}

export class PermissionsService {
	public ensureCanManageUser(currentUser: User, user: UserRestrictionFields): void {
		switch (currentUser.role) {
			case UserRole.Admin:
				if (user.role === UserRole.Admin) {
					throw new MissingRolePermissionsError();
				}
				break;
			case UserRole.RegionalAdmin:
				if (
					[UserRole.Admin, UserRole.RegionalAdmin].includes(user.role) ||
					([UserRole.CommunityAdmin || UserRole.Volunteer || UserRole.Operator].includes(user.role) &&
						currentUser.regionId !== user.regionId)
				) {
					throw new MissingRolePermissionsError();
				}
				break;
			case UserRole.CommunityAdmin:
				if (
					[UserRole.Admin, UserRole.RegionalAdmin, UserRole.CommunityAdmin, UserRole.Operator].includes(user.role) ||
					(user.role === UserRole.Volunteer && currentUser.communityId !== user.communityId)
				) {
					throw new MissingRolePermissionsError();
				}
				break;
			case UserRole.Volunteer:
				// Volunteer can't manage any users
				throw new MissingRolePermissionsError();
			case UserRole.Operator:
				// Operator can't manage any users
				throw new MissingRolePermissionsError();
		}
	}

	public ensureCanManageIncident(currentUser: User, incident: IncidentRestrictionFields): void {
		switch (currentUser.role) {
			case UserRole.Admin:
				break;
			case UserRole.RegionalAdmin: {
				if (currentUser.regionId !== incident.regionId) {
					throw new MissingRolePermissionsError();
				}
				break;
			}
			case UserRole.CommunityAdmin:
			case UserRole.Operator: {
				if (currentUser.regionId !== incident.regionId || currentUser.communityId !== incident.communityId) {
					throw new MissingRolePermissionsError();
				}
				break;
			}
			case UserRole.Volunteer:
				throw new MissingRolePermissionsError();
		}
	}

	public ensureOperatorCanManageCommunityIncident(operator: User, community: Community): void {
		if (operator.districtId !== community.districtId) {
			throw new MissingRolePermissionsError();
		}
	}
}

export class MissingRolePermissionsError extends ApplicationError {}

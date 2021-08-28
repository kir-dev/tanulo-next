import { User } from '../users/user'
import { GroupRole } from './grouprole'

/**
 * User with role
 */
export class GroupMember extends User {
  groupRole: GroupRole

  isOwner(): boolean {
    return this.groupRole === GroupRole.owner
  }

  isApproved(): boolean {
    return this.groupRole !== GroupRole.unapproved
  }
}

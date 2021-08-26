import { Group } from '../groups/group'
import { GroupRole } from '../groups/grouprole'

export { Group, GroupRole }


/**
 *  Group class containing role of user
 */
export class GroupOfUser extends Group {
  groupRole: GroupRole;
}

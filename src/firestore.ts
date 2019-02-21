/**
 * Firestore database
 */
import { UserData, UserResult } from './common/user'
import { db } from './firebase'

enum Coll {
  members = '/members',
  users = '/users',
}

type MemberData = {
  checkDisplayNameSort: boolean
  displayName: string
  displayNameSort: string
  firstName: string
  lastName: string
}

// database document property names
const props = {
  member: {
    checkDisplayNameSort: 'checkDisplayNameSort',
    firstName: 'firstName',
    lastName: 'lastName',
  },
}

const membersRef = db.collection(Coll.members)

/**
 * Fetches the user from database.
 * @param uid Logged-in user id
 * @returns Query result
 */
const fetchUser = (uid: string): Promise<UserResult> =>
  db
    .collection('/users')
    .doc(uid)
    .get()
    .then(doc => (doc.exists ? { valid: true, user: doc.data() as UserData } : { valid: false }))

const fetchCheckSortNameMembers = () =>
  membersRef.where(props.member.checkDisplayNameSort, '==', true)

export { MemberData, fetchCheckSortNameMembers, fetchUser, membersRef, props }

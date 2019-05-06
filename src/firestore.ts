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

type ProgramParticipantData = {
  memberId: string
  fullName: string
  displayName: string
  email: string
  participateProgram: boolean
  participateProgramAnswer: string
}

// database document property names
const props = {
  member: {
    checkDisplayNameSort: 'checkDisplayNameSort',
    firstName: 'firstName',
    lastName: 'lastName',
    participateProgram: 'participateProgram',
    participateProgramAnswer: 'participateProgramAnswer',
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

const _fetchParticipantsOfType = async matchVal => {
  const querySnapshot = await membersRef
    .where(props.member.participateProgram, '==', matchVal)
    .get()
  const participants: ProgramParticipantData[] = []
  querySnapshot.forEach(docSnapshot => {
    participants.push(docSnapshot.data() as ProgramParticipantData)
  })
  return participants
}

const fetchProgramParticipants = async () => {
  const [sure, perhaps] = await Promise.all([
    _fetchParticipantsOfType(true),
    _fetchParticipantsOfType(null),
  ])
  return [...sure, ...perhaps]
}

export {
  MemberData,
  ProgramParticipantData,
  fetchCheckSortNameMembers,
  fetchProgramParticipants,
  fetchUser,
  membersRef,
  props,
}

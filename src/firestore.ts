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
  fullName: string
  fullNameSort: string
  lastName: string
  memberId: string
}

type ProgramParticipantData = {
  memberId: string
  fullName: string
  displayName: string
  email: string
  participateProgram: boolean
  participateProgramAnswer: string
}

type BadgeData = {
  displayName: string
  location: string
  twitter: string
}

type RegistrationData = {
  fullName: string
  badgeName: string
  badgePrinted: boolean
  memberId: string
}

// database document property names
const props = {
  member: {
    checkDisplayNameSort: 'checkDisplayNameSort',
    displayNameSort: 'displayNameSort',
    firstName: 'firstName',
    fullName: 'fullName',
    fullNameSort: 'fullNameSort',
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

// fetch all members for filtering in the UI
// e.g. missing fields cannot be queried directly
const fetchAllMembers = () => membersRef

const fetchParticipantsOfType = async matchVal => {
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
    fetchParticipantsOfType(true),
    fetchParticipantsOfType(null),
  ])
  return [...sure, ...perhaps]
}

const fetchRegistrationList = async () => {
  const querySnapshot = await membersRef.orderBy(props.member.fullNameSort).get()
  const members: RegistrationData[] = []
  querySnapshot.forEach(docSnapshot => {
    members.push(docSnapshot.data() as RegistrationData)
  })

  return members
}

const fetchBadgeData = async () => {
  const querySnapshot = await membersRef.orderBy(props.member.displayNameSort).get()
  const members: BadgeData[] = []
  querySnapshot.forEach(docSnapshot => {
    members.push(docSnapshot.data() as BadgeData)
  })

  return members
}

export {
  BadgeData,
  MemberData,
  ProgramParticipantData,
  RegistrationData,
  fetchAllMembers,
  fetchBadgeData,
  fetchCheckSortNameMembers,
  fetchProgramParticipants,
  fetchRegistrationList,
  fetchUser,
  membersRef,
  props,
}

import * as functions from 'firebase-functions'
import { createdAtTimestamp, modifiedAtTimestamp } from './document-timestamp'
import * as store from './firestore'
import { MemberNames, namesHaveChanged, updateNameData } from './member'
import List, * as membersList from './memberslist'
import { UserData } from './common/user'

/**
 * Add a timestamp to every new purchase record.
 */
export const addTimestampToNewPurchase = functions.firestore
  .document('purchases/{purchaseId}')
  .onCreate((snapshot) => snapshot.ref.set(createdAtTimestamp(), { merge: true }))

/**
 * Update generated names and add 'createdAt' timestamp to new member records.
 */
export const addNewMember = functions.firestore
  .document('members/{memberId}')
  .onCreate((snapshot) => {
    const memberData = snapshot.data() as MemberNames
    console.log(`New member added: ${memberData.firstName} ${memberData.lastName}`)
    const memberWithUpdatedNameData = updateNameData(memberData)

    return snapshot.ref.set(
      { ...memberWithUpdatedNameData, ...createdAtTimestamp() },
      { merge: true }
    )
  })

/**
 * Update generated names and add 'modifiedAt' timestamp to updated member records.
 *
 * Update record only if user-specified name fields have changed.
 */
export const updateMember = functions.firestore
  .document('members/{memberId}')
  .onUpdate(async (change) => {
    const oldMemberData = change.before
      ? (change.before.data() as MemberNames)
      : ({} as MemberNames)
    console.log(`Member update triggered: ${oldMemberData.firstName} ${oldMemberData.lastName}`)
    if (!change.after) {
      console.log('No after data set - exiting')
      return null
    }
    const submittedMemberData = change.after.data() as MemberNames

    if (!namesHaveChanged(oldMemberData, submittedMemberData)) {
      console.log('No change to member names.')
      return null
    }

    console.log('Member names have changed - updating name data.')
    console.log('old', oldMemberData)
    console.log('submitted', submittedMemberData)

    const memberWithUpdatedNameData = updateNameData(submittedMemberData)

    return change.after.ref.set(
      { ...memberWithUpdatedNameData, ...modifiedAtTimestamp() },
      { merge: true }
    )
  })

/**
 * Fetch formatted members list for the website
 */
export const listMembers = functions.https.onRequest(async (req, res) => {
  res.setHeader('content-type', 'text/plain')
  try {
    const membersPromise = store.fetchMembers() as Promise<membersList.memberData[]>
    const [allMembers, importedAt] = await Promise.all([membersPromise, store.fetchUpdateDate()])
    const members = new List(allMembers)

    const updateMessage = `Updated on ${importedAt ? importedAt.toDateString() : 'Unknown'}`
    res.send(members.toMarkdown() + '\n\n' + updateMessage)
  } catch (err) {
    console.error('Could not fetch members list')
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

const newUser = (uid: string, name: string = 'Unknown'): UserData => ({ uid, name, roles: [] })

/**
 * Create user record for authenticated users.
 */
export const addUser = functions.auth
  .user()
  .onCreate(({ uid, displayName }) => store.addUser(newUser(uid, displayName)))

/**
 * Delete store data when user auth account is deleted.
 */
export const deleteUser = functions.auth.user().onDelete(({ uid }) => store.deleteUser(uid))

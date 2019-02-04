import * as functions from 'firebase-functions'
import {
  addCreatedAtTimestamp,
  createdAtTimestamp,
  modifiedAtTimestamp,
} from './document-timestamp'
import * as store from './firestore'
import { MemberNames, updateNameData } from './member'
import List, * as membersList from './memberslist'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!!')
})

/**
 * Add a timestamp to every new purchase record.
 */
export const addTimestampToNewPurchase = functions.firestore
  .document('purchases/{purchaseId}')
  .onCreate((snapshot, context) => addCreatedAtTimestamp(snapshot))

/**
 * Update generated names and add 'createdAt' timestamp to new member records.
 */
export const addNewMember = functions.firestore
  .document('members/{memberId}')
  .onCreate((snapshot, context) => {
    const memberData = snapshot.data() as MemberNames
    console.log(
      `New member added: ${memberData.firstName} ${memberData.lastName}`
    )

    const memberWithUpdatedNameData = updateNameData(memberData)
    return snapshot.ref
      .set(
        { ...memberWithUpdatedNameData, ...createdAtTimestamp() },
        { merge: true }
      )
      .catch((err) => {
        console.error(err)
        return false
      })
  })

const namesHaveChanged = (oldNames: MemberNames, newNames: MemberNames) =>
  !oldNames || // new record
  oldNames.firstName !== newNames.firstName ||
  oldNames.lastName !== newNames.lastName ||
  oldNames.badgeName !== newNames.badgeName

/**
 * Update generated names and add 'modifiedAt' timestamp to updated member records.
 *
 * Update record only if user-specified name fields have changed.
 */
export const updateMember = functions.firestore
  .document('members/{memberId}')
  .onUpdate((change, context) => {
    const oldMemberData = change.before.data() as MemberNames
    console.log(
      `Member update triggered: ${oldMemberData.firstName} ${
        oldMemberData.lastName
      }`
    )
    const submittedMemberData = change.after.data() as MemberNames

    if (!namesHaveChanged(oldMemberData, submittedMemberData)) {
      console.log('No change to member names.')
      return null
    }

    console.log('Member names have changed - updating name data.')
    console.log('old', oldMemberData)
    console.log('submitted', submittedMemberData)

    const memberWithUpdatedNameData = updateNameData(submittedMemberData)

    return change.after.ref
      .set(
        { ...memberWithUpdatedNameData, ...modifiedAtTimestamp() },
        { merge: true }
      )
      .catch((err) => {
        console.error(err)
        return false
      })
  })

/**
 * Fetch formatted members list for the website
 */
export const listMembers = functions.https.onRequest(async (req, res) => {
  res.setHeader('content-type', 'text/plain')
  try {
    const membersPromise = store.fetchMembers() as Promise<
      membersList.memberData[]
    >
    const [allMembers, importedAt] = await Promise.all([
      membersPromise,
      store.fetchUpdateDate(),
    ])
    const members = new List(allMembers)

    const updateMessage = `Updated at ${
      importedAt ? importedAt.toDateString() : 'Unknown'
    }`
    res.status(200).send(members.toMarkdown() + '\n\n' + updateMessage)
  } catch (err) {
    console.error('Could not fetch members list')
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

import * as assert from 'assert'
import * as functions from 'firebase-functions'
import {
  addCreatedAtTimestamp,
  filterOutTimestamps,
  updateModifiedAtTimestamp,
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
 * Add a timestamp to every new member record.
 */
export const addTimestampToNewMember = functions.firestore
  .document('members/{memberId}')
  .onCreate((snapshot, context) => addCreatedAtTimestamp(snapshot))

export const updateTimestampOnMemberUpdate = functions.firestore
  .document('members/{memberId}')
  .onUpdate((change, context) => {
    const dataBefore = filterOutTimestamps(change.before.data() || {})
    const dataAfter = filterOutTimestamps(change.after.data() || {})

    try {
      assert.notDeepEqual(dataBefore, dataAfter)
    } catch (err) {
      return null
    }

    return updateModifiedAtTimestamp(change.after)
  })

const namesHaveChanged = (oldNames: MemberNames, newNames: MemberNames) =>
  !oldNames || // new record
  oldNames.firstName !== newNames.firstName ||
  oldNames.lastName !== newNames.lastName ||
  oldNames.badgeName !== newNames.badgeName

export const updateNameDataOnWrite = functions.firestore
  .document('members/{memberId}')
  .onWrite((change, context) => {
    const oldMemberData = change.before.data() as MemberNames

    if (!change.after.exists) return null

    const submittedMemberData = change.after.data() as MemberNames

    if (!namesHaveChanged(oldMemberData, submittedMemberData)) {
      // console.log('No changes to member names')
      return null
    }

    // console.log('Member name properties changed - updating name data')
    const newMemberData = updateNameData(submittedMemberData)

    // console.log('old document', oldMemberData)
    // console.log('changed document', newMemberData)

    // return newMemberData
    return change.after.ref.set(newMemberData).catch((err) => {
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
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

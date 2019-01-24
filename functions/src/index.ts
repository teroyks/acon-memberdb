import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!!')
})

/**
 * Create a 'createdAt' timestamp object.
 * @returns timestamp object to add to a document reference.
 */
const createdAtTimestamp = () => ({
  createdAt: firestore.FieldValue.serverTimestamp(),
})

/**
 * Add a 'createdAt' property to a document snapshot.
 * @param snapshot
 */
const addCreatedAtTimestamp = (snapshot: firestore.DocumentSnapshot) => {
  return snapshot.ref
    .set(createdAtTimestamp(), { merge: true })
    .catch((err) => {
      console.log(err)
      return false
    })
}

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

import * as functions from 'firebase-functions'

import addCreatedAtTimestamp from './document-created-at'

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

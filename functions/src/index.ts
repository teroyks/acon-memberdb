import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!!')
})

/**
 * Add a timestamp to every new purchase record.
 */
export const createPurchase = functions.firestore
  .document('purchases/{purchaseId}')
  .onCreate((snapshot, context) => {
    return snapshot.ref
      .set(createdAtTimestamp(), { merge: true })
      .catch((err) => {
        console.log(err)
        return false
      })
  })

/**
 * Create a 'createdAt' timestamp object.
 * @returns timestamp object to add to a document reference.
 */
const createdAtTimestamp = () => ({
  createdAt: firestore.FieldValue.serverTimestamp(),
})

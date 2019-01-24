import { firestore } from 'firebase-admin'

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

export default addCreatedAtTimestamp

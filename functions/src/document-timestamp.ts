import { firestore } from 'firebase-admin'

/**
 * Generate current timestamp in Firestore format.
 */
const firestoreTimestamp = () => firestore.FieldValue.serverTimestamp()

/**
 * Add a 'createdAt' property to a document snapshot.
 * @param snapshot
 */
const addCreatedAtTimestamp = (snapshot: firestore.DocumentSnapshot) => {
  return snapshot.ref
    .set({ createdAt: firestoreTimestamp() }, { merge: true })
    .catch((err) => {
      console.log(err)
      return false
    })
}

const createdAtTimestamp = () => ({ createdAt: firestoreTimestamp() })
const modifiedAtTimestamp = () => ({ modifiedAt: firestoreTimestamp() })

type anyObject = {
  [key: string]: any
}

const filterOutTimestamps = (origObj: anyObject): anyObject =>
  Object.keys(origObj)
    .filter((key) => !key.endsWith('edAt'))
    .reduce((obj, key) => ({ ...obj, [key]: origObj[key] }), {})

export {
  addCreatedAtTimestamp,
  createdAtTimestamp,
  filterOutTimestamps,
  modifiedAtTimestamp,
}

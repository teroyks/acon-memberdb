import { firestore } from 'firebase-admin'

/**
 * Generate current timestamp in Firestore format.
 */
const firestoreTimestamp = () => firestore.FieldValue.serverTimestamp()

const createdAtTimestamp = () => ({ createdAt: firestoreTimestamp() })
const modifiedAtTimestamp = () => ({ modifiedAt: firestoreTimestamp() })

type anyObject = {
  [key: string]: any
}

const filterOutTimestamps = (origObj: anyObject): anyObject =>
  Object.keys(origObj)
    .filter((key) => !key.endsWith('edAt'))
    .reduce((obj, key) => ({ ...obj, [key]: origObj[key] }), {})

export { createdAtTimestamp, filterOutTimestamps, modifiedAtTimestamp }

/**
 * Fetch data from Firestore
 */

import * as admin from 'firebase-admin'

admin.initializeApp()
const store = admin.firestore()
store.settings({ timestampsInSnapshots: true }) // required to get rid of deprecation warnings

/**
 * Fetch data for all members
 * @returns Promise Array of DocumentData
 */
const fetchMembers = async () => {
  const querySnapshot = await store
    .collection('/members')
    .orderBy('displayNameSort')
    .get()

  return querySnapshot.docs.map((doc) => doc.data())
}

export { fetchMembers }

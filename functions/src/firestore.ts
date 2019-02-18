/**
 * Handle Firestore data fetch and write.
 */

import * as admin from 'firebase-admin'
import { UserData } from './common/user'

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

  return querySnapshot.docs.map(doc => doc.data())
}

/**
 * Fetch last import date
 * @returns Promise Date | null
 */
const fetchUpdateDate = async (): Promise<Date | null> => {
  const querySnapshot = await store.doc('/meta/status').get()
  const data = querySnapshot.data()

  return data ? data.importedAt.toDate() : null
}

/**
 * Add member db user.
 * Existing user with the same uid will be overwritten.
 * @param user User data
 * @returns Write result promise
 */
const addUser = (user: UserData) =>
  store
    .collection('/users')
    .doc(user.uid)
    .set(user)

const deleteUser = (uid: string) =>
  store
    .collection('/users')
    .doc(uid)
    .delete()

export { addUser, deleteUser, fetchMembers, fetchUpdateDate }

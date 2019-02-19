/**
 * Firestore database
 */
import { UserData, UserResult } from './common/user'
import { db } from './firebase'

/**
 * Fetches the user from database.
 * @param uid Logged-in user id
 * @returns Query result
 */
const fetchUser = (uid: string): Promise<UserResult> =>
  db
    .collection('/users')
    .doc(uid)
    .get()
    .then(doc => (doc.exists ? { valid: true, user: doc.data() as UserData } : { valid: false }))

export { fetchUser }

/**
 * Handles authenticated users.
 */

enum Role {
  admin = 'Administrator', // can manage other users
  editor = 'Editor', // can edit member data
  user = 'User', // can view public member data and reports
}

type UserData = {
  readonly uid: string
  readonly name: string
  readonly roles: Role[]
}
type UserList = {
  readonly [uid: string]: UserData
}

type UserResult = {
  valid: boolean // true if user found
  user?: UserData // user data for a valid result
}

// temporary user list
const users: UserList = {
  foo: {
    uid: 'foo',
    name: 'Foo',
    roles: [Role.admin, Role.editor, Role.user],
  },
  user: {
    uid: 'bar',
    name: 'Bar',
    roles: [Role.user],
  },
  admin: {
    uid: 'boo',
    name: 'I am an admin',
    roles: [Role.admin, Role.user],
  },
  none: {
    uid: 'none',
    name: 'Baz Cannot Do Anything',
    roles: [],
  },
}

/**
 * Fetches the user from database.
 * @param uid Logged-in user id
 * @returns Query result
 */
const fetchUser = (uid: string): UserResult =>
  users[uid] ? { valid: true, user: users[uid] } : { valid: false }

export { Role, UserData, UserResult, fetchUser }

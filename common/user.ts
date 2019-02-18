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

export { Role, UserData, UserList, UserResult }

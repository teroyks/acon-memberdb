/**
 * Member record-related functions
 */

const formName = (names: string[]) => names.join(' ').trim()

/**
 * Member object fields.
 */
interface MemberNames {
  firstName: string
  lastName: string
  badgeName: string | null
}

/**
 * Construct a display name
 * - use badge name if provided
 * - otherwise full name (first name first)
 * @param param0 member name fields
 */
const displayName = ({ firstName, lastName, badgeName }: MemberNames) =>
  badgeName ? badgeName : formName([firstName, lastName])

/**
 * Construct a full name
 * @param param0 member name object
 */
const fullName = ({ firstName, lastName }: MemberNames) => formName([firstName, lastName])

/**
 * Constructs real name for sorting
 * @param param0
 */
const fullNameSort = ({ firstName, lastName }: MemberNames) =>
  formName([lastName, firstName]).toLowerCase()

/**
 * Construct a name for sorting by display name
 * @param param0 member name fields
 */
const displayNameSort = ({ firstName, lastName, badgeName }: MemberNames) =>
  badgeName
    ? badgeName.toLowerCase() === formName([firstName, lastName]).toLowerCase()
      ? fullNameSort({ firstName, lastName, badgeName: null })
      : badgeName.toLowerCase()
    : fullNameSort({ firstName, lastName, badgeName })

/**
 * Checks if member name values have changed
 * (ie. if needs to update name data)
 * @param oldNames
 * @param newNames
 */
const namesHaveChanged = (oldNames: MemberNames, newNames: MemberNames) =>
  !oldNames || // new record
  oldNames.firstName !== newNames.firstName ||
  oldNames.lastName !== newNames.lastName ||
  oldNames.badgeName !== newNames.badgeName

/**
 * Checks if display name sort order can be determined automatically
 * - false if no badge name given (sort by lastname)
 * - false if badge name given but matches full name (sort by lastname)
 * - true otherwise (sort by badge name by default)
 * @param param0
 */
const needToCheckDisplayNameSort = ({ firstName, lastName, badgeName }: MemberNames) => {
  if (!badgeName) return false
  if (badgeName === formName([firstName, lastName])) return false
  if (badgeName === formName([lastName, firstName])) return false

  return true
}

const updateNameData = (memberData: any) => {
  const updatedMember = { ...memberData }

  updatedMember.displayName = displayName(memberData)
  updatedMember.displayNameSort = displayNameSort(memberData)
  updatedMember.checkDisplayNameSort = needToCheckDisplayNameSort(memberData)

  updatedMember.fullNameSort = fullNameSort(memberData)

  updatedMember.fullName = fullName(memberData)

  return updatedMember
}

export { MemberNames, namesHaveChanged, updateNameData }

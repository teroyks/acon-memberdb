/**
 * Member record-related functions
 */

const fullName = (names: string[]) => names.join(' ').trim()

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
  badgeName ? badgeName : fullName([firstName, lastName])

/**
 * Construct a name for sorting by display name
 * @param param0 member name fields
 */
const displayNameSort = ({ firstName, lastName, badgeName }: MemberNames) => {
  const fullNameSort = fullName([lastName, firstName])
  if (badgeName) {
    return badgeName === fullName([firstName, lastName])
      ? fullNameSort
      : badgeName
  }

  return fullName([lastName, firstName])
}

/**
 * Checks if display name sort order can be determined automatically
 * - false if no badge name given (sort by lastname)
 * - false if badge name given but equals to "firstname lastname" (sort by lastname)
 * - true otherwise (sort by badge name by default)
 * @param param0
 */
const needToCheckDisplayNameSort = ({
  firstName,
  lastName,
  badgeName,
}: MemberNames) => {
  if (!badgeName) return false

  if (badgeName == fullName([firstName, lastName])) return false

  return true
}

/**
 * Constructs real name for sorting
 * @param param0
 */
const fullNameSort = ({ firstName, lastName }: MemberNames) =>
  fullName([lastName, firstName])

const updateNameData = (memberData: any) => {
  const updatedMember = Object.assign({}, memberData)

  updatedMember.displayName = displayName(memberData)
  updatedMember.displayNameSort = displayNameSort(memberData)
  updatedMember.checkDisplayNameSort = needToCheckDisplayNameSort(memberData)

  updatedMember.fullNameSort = fullNameSort(memberData)

  if (!memberData.badgeName) updatedMember.badgeName = displayName(memberData)

  return updatedMember
}

export { MemberNames, updateNameData }

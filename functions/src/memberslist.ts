/**
 * List of public members
 */

// member data received from a firestore record
type memberData = {
  displayName: string
  publishPermission: boolean
}

// member data properties in the public list
type publicMemberData = {
  name: string
}

const getMemberPublicData = (member: memberData): publicMemberData => {
  return { name: member.displayName }
}

/**
 * List only the public members' data.
 * @param members
 */
const getPublicMembersList = (members: memberData[]) => {
  const publicMembers = members
    .filter((member) => member.publishPermission)
    .map((member) => getMemberPublicData(member))

  return publicMembers
}

const getPrivateMemberCount = (members: memberData[]) => {
  const privateMembers = members.filter((member) => !member.publishPermission)

  return privateMembers.length
}

class List {
  allMembers: memberData[]

  constructor(members: memberData[]) {
    this.allMembers = members
  }

  toMarkdown() {
    const memberToMarkdown = (member: publicMemberData) => member.name

    const publicList = getPublicMembersList(this.allMembers).map((member) =>
      memberToMarkdown(member)
    )

    const toMarkdownList = (itemList: string[]) =>
      itemList.map((item) => `* ${item}`)

    const privateCount = getPrivateMemberCount(this.allMembers)
    const privateLine = `In addition, ${privateCount} members did not wish their names to be published`

    const lines = [...publicList, privateLine]

    return toMarkdownList(lines).join('\n')
  }
}

export default List
export { memberData }

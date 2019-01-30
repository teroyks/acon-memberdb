/**
 * List of public members
 */

// member data received from a firestore record
type memberData = {
  displayName: string
  publishPermission: boolean
  twitter: string | null
}

// member data properties in the public list
type publicMemberData = {
  name: string
  twitter: string | null
  twitterURL: string | null
}

const twitterHandleWithoutAt = (handle: string) => handle.replace(/^@/, '')
const createTwitterUrl = (handle: string | null) =>
  handle ? `https://twitter.com/${twitterHandleWithoutAt(handle)}` : null

const getMemberPublicData = (member: memberData): publicMemberData => ({
  name: member.displayName,
  twitter: member.twitter,
  twitterURL: createTwitterUrl(member.twitter),
})

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
    const memberToMarkdown = (member: publicMemberData) => {
      const props = [member.name]
      const handle = member.twitter
      if (handle) props.push(`[${handle}](${createTwitterUrl(handle)})`)
      return props.join(' ')
    }

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

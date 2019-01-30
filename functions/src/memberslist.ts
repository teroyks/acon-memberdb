/**
 * List of public members
 */
type memberData = {
  displayName: string
  publishPermission: boolean
}

const getMemberPublicData = (member: memberData) => {
  return member.displayName
}

const toMarkdownList = (itemList: string[]) =>
  itemList.map((item) => `* ${item}`)

const getMembersList = (members: memberData[]) => {
  const publicMembers = members
    .filter((member) => member.publishPermission)
    .map((member) => getMemberPublicData(member))

  return publicMembers
}

const getPrivateMemberCount = (members: memberData[]) => {
  const privateMembers = members.filter((member) => !member.publishPermission)

  return privateMembers.length
}

const membersListMarkdown = (members: memberData[]) => {
  const privateCount = getPrivateMemberCount(members)
  const privateLine = `In addition, ${privateCount} members did not wish their names to be published`
  const lines = [...getMembersList(members), privateLine]
  return toMarkdownList(lines).join('\n')
}

export default membersListMarkdown
export { memberData }

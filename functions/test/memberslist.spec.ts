import { expect } from 'chai'
import 'mocha'

import membersList, { memberData } from '../src/memberslist'

describe('Members list', () => {
  describe('Format as markdown', () => {
    it('should return a markdown string with member items', () => {
      const members: memberData[] = [
        { displayName: 'Foo Bar', publishPermission: true },
        { displayName: 'Baz Baz', publishPermission: true },
      ]

      expect(membersList(members)).to.match(/^\* Foo Bar\n\* Baz Baz\n/)
    })

    it('should only list public members', () => {
      const members: memberData[] = [
        { displayName: 'I am public', publishPermission: true },
        { displayName: 'I want to be private', publishPermission: false },
        { displayName: 'Yay publish me', publishPermission: true },
        { displayName: 'I am secret', publishPermission: false },
      ]

      const markdownList = membersList(members)
      expect(markdownList).to.match(/^\* I am public\n\* Yay publish me\n/)
      expect(markdownList).to.not.match(/private/)
    })

    it('should add private member count', () => {
      const members: memberData[] = [
        { displayName: 'private1', publishPermission: false },
        { displayName: 'public', publishPermission: true },
        { displayName: 'private2', publishPermission: false },
      ]

      expect(membersList(members)).to.equal(
        '* public\n* In addition, 2 members did not wish their names to be published'
      )
    })
  })
})

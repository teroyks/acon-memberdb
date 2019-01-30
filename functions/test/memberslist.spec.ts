import { expect } from 'chai'
import 'mocha'

import List, { memberData } from '../src/memberslist'

describe('Members list', () => {
  describe('Format as markdown', () => {
    it('should return a markdown string with member items', () => {
      const members: memberData[] = [
        { displayName: 'Foo Bar', publishPermission: true, twitter: null },
        { displayName: 'Baz Baz', publishPermission: true, twitter: null },
      ]

      const list = new List(members)
      expect(list.toMarkdown()).to.match(/^\* Foo Bar\n\* Baz Baz\n/)
    })

    it('should only list public members', () => {
      const members: memberData[] = [
        { displayName: 'I am public', publishPermission: true, twitter: null },
        { displayName: 'Me private', publishPermission: false, twitter: null },
        { displayName: 'Publish me', publishPermission: true, twitter: null },
        { displayName: 'I am secret', publishPermission: false, twitter: null },
      ]

      const markdownList = new List(members).toMarkdown()
      expect(markdownList).to.match(/^\* I am public\n\* Publish me\n/)
      expect(markdownList).to.not.match(/private/)
    })

    it('should add private member count', () => {
      const members: memberData[] = [
        { displayName: 'private1', publishPermission: false, twitter: null },
        { displayName: 'public', publishPermission: true, twitter: null },
        { displayName: 'private2', publishPermission: false, twitter: null },
      ]

      const markdownList = new List(members).toMarkdown()
      expect(markdownList).to.equal(
        '* public\n* In addition, 2 members did not wish their names to be published'
      )
    })

    it('should include Twitter link', () => {
      const members: memberData[] = [
        { displayName: 'foo', publishPermission: true, twitter: '@tweeter' },
      ]

      const markdownList = new List(members).toMarkdown()
      expect(markdownList).to.match(
        /^\* foo \[@tweeter]\(https:\/\/twitter\.com\/tweeter\)\n/
      )
    })
  })
})

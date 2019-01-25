import { expect } from 'chai'
import 'mocha'

import { MemberNames, updateNameData } from '../src/member'

describe('Member name handling', () => {
  describe('Display name', () => {
    it('should use full name when badge name not given', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: null,
      }
      const member = updateNameData(before)
      expect(member.displayName).to.equal('foo bar')
    })

    it('should use first name if last name and badge name not given', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: '',
        badgeName: null,
      }
      const member = updateNameData(before)
      expect(member.displayName).to.equal('foo')
    })

    it('should use badge name if given', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: 'baz',
      }
      const member = updateNameData(before)
      expect(member.displayName).to.equal('baz')
    })

    it('should handle empty strings', () => {
      const before: MemberNames = {
        firstName: '',
        lastName: '',
        badgeName: null,
      }
      const member = updateNameData(before)
      expect(member.displayName).to.equal('')
    })
  })

  describe('Badge name', () => {
    it('should use given badge name', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: 'bazbaz',
      }
      const member = updateNameData(before)
      expect(member.badgeName).to.equal('bazbaz')
    })

    it('should create badge name from real name if not given', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: null,
      }
      const member = updateNameData(before)
      expect(member.badgeName).to.equal('foo bar')
    })

    it('should not modify original data', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: null,
      }
      updateNameData(before)
      expect(before.badgeName).to.equal(null)
    })
  })

  describe('Display name sort value', () => {
    it('should use full name when badge name not given', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: null,
      }
      const member = updateNameData(before)
      expect(member.displayNameSort).to.equal('bar foo')
      expect(member.checkDisplayNameSort).to.equal(false)
    })

    it('should use badge name as-is if given', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: 'baz bam',
      }
      const member = updateNameData(before)
      expect(member.displayNameSort).to.equal('baz bam')
      expect(member.checkDisplayNameSort).to.equal(true)
    })

    it('should recognize badge name that matches real name', () => {
      const before: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: 'foo bar',
      }
      const member = updateNameData(before)
      expect(member.displayNameSort).to.equal('bar foo')
      expect(member.checkDisplayNameSort).to.equal(false)
    })
  })

  describe('Full name sort value', () => {
    it('should use full name even when badge name is given', () => {
      const originalMember: MemberNames = {
        firstName: 'foo',
        lastName: 'bar',
        badgeName: 'baz',
      }
      const member = updateNameData(originalMember)
      expect(member.fullNameSort).to.equal('bar foo')
    })

    it('should work with only first name', () => {
      const originalMember: MemberNames = {
        firstName: 'foo',
        lastName: '',
        badgeName: null,
      }
      const member = updateNameData(originalMember)
      expect(member.fullNameSort).to.equal('foo')
    })
  })
})

import { expect } from 'chai'
import 'mocha'

import { filterOutTimestamps } from '../src/document-timestamp'

describe('Timestamp handling', () => {
  describe('Fllter out timestamps from record', () => {
    it('should not include timestamps in filtered data', () => {
      const data = {
        foo: 1,
        createdAt: 2,
        bar: true,
        modifiedAt: 123,
      }

      expect(filterOutTimestamps(data)).to.deep.equal({ foo: 1, bar: true })
    })

    it('should not modify original data', () => {
      const data = {
        foo: true,
        createdAt: 'now',
      }

      expect(filterOutTimestamps(data)).to.deep.equal({ foo: true })
      expect(data).to.deep.equal({ foo: true, createdAt: 'now' })
    })
  })
})

/**
 * Twitter utility functions
 */

const baseURL = 'https://twitter.com'

const withoutAtSign = (handle: string) => handle.replace(/^@/, '')

const createUrl = (handle: string | null) =>
  handle ? `${baseURL}/${withoutAtSign(handle)}` : null

export { createUrl, withoutAtSign }

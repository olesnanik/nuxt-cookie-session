import { expect } from 'vitest'
import type { CookieOptions } from '../../src/types'

type Expected = Record<string, string>

export function getExpectedCookiesByOptions (name: string, options?: CookieOptions): Expected {
  const expected: Expected = {
    [name]: expect.stringMatching(/.*/),
    Path: options?.path ?? '/'
  }

  if (options) {
    if (options.domain) {
      expected.Domain = options.domain
    }

    if (options.maxAge) {
      expected['Max-Age'] = '' + options.maxAge
    }

    if (options.sameSite) {
      const sameSite = options.sameSite === true ? 'strict' : options.sameSite
      expected.SameSite = sameSite.slice(0, 1).toUpperCase() + sameSite.slice(1)
    }

    if (options.secure) {
      expected.Secure = ''
    }

    if (options.httpOnly) {
      expected.HttpOnly = ''
    }
  }

  return expected
}

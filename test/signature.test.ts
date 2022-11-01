import { describe, it, expect } from 'vitest'
import { signCookieId, unsignCookieId } from '../src/runtime/server/utils/signature'

describe('signature', () => {
  it('Signed cookie id should be unsigned correctly.', async () => {
    const cookieId = 'test-cookie-id'
    const secret = 'test-secret'
    const prefix = 'test-prefix'

    const signedCookieId = await signCookieId(cookieId, secret, prefix)
    expect(await unsignCookieId(signedCookieId, secret, prefix)).toEqual(cookieId)
  })
})

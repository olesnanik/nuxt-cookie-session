import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { parse as parseCookie } from 'es-cookie'
import { setup, fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH, getDefaultModuleOptions } from '../src/config'
import type { CookieOptions } from '../src/types'
import CookieSessionModule from '..'
import { getExpectedCookiesByOptions } from './util/cookie'

describe('cookie custom options', async () => {
  const cookieOptions: CookieOptions = {
    domain: 'localhost',
    path: '/test-path',
    maxAge: 10000,
    secure: false,
    httpOnly: false,
    sameSite: 'none'
  }

  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
    nuxtConfig: {
      modules: [
        [
          // @ts-ignore
          CookieSessionModule,
          {
            cookie: cookieOptions
          }
        ]
      ]
    }
  })

  describe('cookie', () => {
    it('Cookie header should match config.', async () => {
      const { headers } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify({ name: 'John Doe' }) }
      )
      const cookieVal = parseCookie(headers.get('set-cookie') ?? '')
      const { name } = getDefaultModuleOptions()

      expect(cookieVal).toStrictEqual(getExpectedCookiesByOptions(name, cookieOptions))
    })
  })
})

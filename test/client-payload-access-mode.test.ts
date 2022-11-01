import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { encode as encodeCookie } from 'es-cookie'
import { setup, fetch, $fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH, getDefaultModuleOptions } from '../src/config'
import { signCookieId } from '../src/runtime/server/utils/signature'
import CookieSessionModule from '..'

describe('client-payload access mode', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
    nuxtConfig: {
      modules: [
        [
          // @ts-ignore
          CookieSessionModule,
          {
            access: {
              mode: 'client-payload'
            }
          }
        ]
      ]
    }
  })

  describe('page', () => {
    it('Data should be included in page payload.', async () => {
      const cookieId = 'cookie-id'
      const { secret, genid: { prefix }, name } = getDefaultModuleOptions()
      const signedCookieId = await signCookieId(cookieId, secret, prefix)

      const html = await $fetch('/', { headers: { cookie: encodeCookie(name, signedCookieId, {}) } })
      expect(html).toContain('Mocked data for cookie-id.')
    })
  })

  describe('api', () => {
    it('GET api should not be accessible.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'GET' })
      expect(headers.get('content-type')).not.toEqual('application/json')
    })

    it('PATCH api should not be accessible.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'PATCH' })
      expect(headers.get('content-type')).not.toEqual('application/json')
    })
  })
})

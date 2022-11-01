import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { encode as encodeCookie } from 'es-cookie'
import { setup, fetch, $fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH, getDefaultModuleOptions } from '../src/config'
import { signCookieId } from '../src/runtime/server/utils/signature'
import CookieSessionModule from '..'

describe('api disabled', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
    nuxtConfig: {
      modules: [
        [
          // @ts-ignore
          CookieSessionModule,
          {
            api: {
              enable: false
            }
          }
        ]
      ]
    }
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

    it('PUT api should not be accessible.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'PUT' })
      expect(headers.get('content-type')).not.toEqual('application/json')
    })

    it('DELETE api should not be accessible.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'DELETE' })
      expect(headers.get('set-cookie')).toEqual(null)
    })
  })

  describe('pages', () => {
    it('Data should be rendered on server.', async () => {
      const cookieId = 'cookie-id'
      await $fetch('/api/cookie-session/storage/' + cookieId, { method: 'POST', body: { data: 'John Doe' } })

      const { secret, genid: { prefix }, name } = getDefaultModuleOptions()
      const signedCookieId = await signCookieId(cookieId, secret, prefix)

      const html = await $fetch('/server-rendered-data', { headers: { cookie: encodeCookie(name, signedCookieId, {}) } })
      expect(html).toContain('John Doe')
    })
  })
})

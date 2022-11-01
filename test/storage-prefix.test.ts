import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { encode as encodeCookie } from 'es-cookie'
import { setup, $fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH, getDefaultModuleOptions } from '../src/config'
import { signCookieId } from '../src/runtime/server/utils/signature'
import CookieSessionModule from '..'

describe('storage prefix', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
    nuxtConfig: {
      modules: [
        [
          // @ts-ignore
          CookieSessionModule,
          {
            storage: {
              id: 'custom-storage',
              keyPrefix: 'prefix'
            },
            access: {
              mode: 'api'
            }
          }
        ]
      ]
    }
  })

  describe('api', () => {
    it('GET api should return value of the prefixed storage key.', async () => {
      const cookieId = 'cookie-id'
      const { secret, genid: { prefix }, name } = getDefaultModuleOptions()
      const signedCookieId = await signCookieId(cookieId, secret, prefix)

      const jsonRes = await $fetch(DEFAULT_API_PATH, { headers: { cookie: encodeCookie(name, signedCookieId, {}) } })
      expect(jsonRes).toEqual({ data: 'Mocked data for prefix:cookie-id.' })
    })
  })
})

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
              keyPrefix: 'test-prefix'
            }
          }
        ]
      ]
    }
  })

  describe('api', () => {
    it('Storage key should be prefixed by "keyPrefix" storage option.', async () => {
      const { secret, genid: { prefix }, name } = getDefaultModuleOptions()
      const signedCookieId = await signCookieId('cookie-id', secret, prefix)
      const cookie = encodeCookie(name, signedCookieId, {})

      await $fetch(DEFAULT_API_PATH, { method: 'PATCH', body: { data: 'John Doe' }, headers: { cookie } })

      const storageKeys = await $fetch('/api/cookie-session/storage/keys')
      expect(storageKeys).toEqual(['test-prefix:cookie-id'])
    })
  })
})

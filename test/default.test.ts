import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH } from '../src/config'
import CookieSessionModule from '..'

describe('default config', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
    nuxtConfig: {
      // @ts-ignore
      modules: [CookieSessionModule]
    }
  })

  describe('cookie', () => {
    it('Cookie should not be set by default.', async () => {
      const { headers } = await fetch('/')
      expect(headers.get('set-cookie')).toEqual(null)
    })
  })

  describe('api', () => {
    it('GET api should not be accessible by default.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'GET' })
      expect(headers.get('content-type')).not.toEqual('application/json')
    })

    it('PATCH api should not be accessible by default.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'PATCH' })
      expect(headers.get('content-type')).not.toEqual('application/json')
    })
  })
})

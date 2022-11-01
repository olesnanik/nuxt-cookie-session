import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH } from '../src/config'
import CookieSessionModule from '..'

describe('api custom path', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
    // @ts-ignore nuxt version conflict
    nuxtConfig: {
      modules: [
        [
          // @ts-ignore
          CookieSessionModule,
          {
            api: {
              path: '/api/custom-cookie-session-path'
            }
          }
        ]
      ]
    }
  })

  describe('api', () => {
    it('Default GET api should not be accessible.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'GET' })
      expect(headers.get('content-type')).not.toEqual('application/json')
    })

    it('Default PATCH api should not be accessible.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'PATCH' })
      expect(headers.get('content-type')).not.toEqual('application/json')
    })

    it('Custom GET api should be accessible.', async () => {
      const { headers } = await fetch('/api/custom-cookie-session-path', { method: 'GET' })
      expect(headers.get('content-type')).toEqual('application/json')
    })

    it('Custom PATCH api should be accessible.', async () => {
      const { headers } = await fetch('/api/custom-cookie-session-path', { method: 'PATCH' })
      expect(headers.get('content-type')).toEqual('application/json')
    })
  })
})

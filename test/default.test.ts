import { fileURLToPath } from 'node:url'
import { parse as parseCookie } from 'es-cookie'
import { describe, it, expect } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH, getDefaultModuleOptions } from '../src/config'
import CookieSessionModule from '..'
import { getExpectedCookiesByOptions } from './util/cookie'

describe('default', async () => {
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

    it('Cookie id should has prefix and length by config.', async () => {
      const { headers } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify({ name: 'John Doe' }) }
      )

      const defaultOptions = getDefaultModuleOptions()
      const cookieVal = parseCookie(headers.get('set-cookie'))[defaultOptions.name]
      const { prefix, length } = defaultOptions.genid

      expect(cookieVal.slice(0, prefix.length)).toEqual(prefix)
      expect(cookieVal.slice(prefix.length, cookieVal.indexOf('.')).length).toEqual(length)
    })

    it('Cookie options should be as secure as possible by default.', async () => {
      const { headers } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify({ name: 'John Doe' }) }
      )
      const cookieVal = parseCookie(headers.get('set-cookie'))
      const { name, cookie } = getDefaultModuleOptions()

      expect(cookieVal).toStrictEqual(getExpectedCookiesByOptions(name, cookie))
    })
  })

  describe('api', () => {
    it('GET api should be accessible by default.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'GET' })
      expect(headers.get('content-type')).toEqual('application/json')
    })

    it('PATCH api should be accessible by default.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'PATCH' })
      expect(headers.get('content-type')).toEqual('application/json')
    })

    it('Data from PATCH api should be accessible by GET api.', async () => {
      const patchData = { name: 'John Doe' }
      const { headers: patchResHeaders } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify(patchData) }
      )
      const getData = await $fetch(
        DEFAULT_API_PATH,
        { method: 'GET', headers: { cookie: patchResHeaders.get('set-cookie') } }
      )

      expect(getData).toEqual(patchData)
    })
  })

  describe('pages', () => {
    it('Data should be rendered on server.', async () => {
      const patchData = { name: 'John Doe' }
      const { headers: patchResHeaders } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify(patchData) }
      )
      const html = await $fetch('/server-rendered-data', { headers: { cookie: patchResHeaders.get('set-cookie') } })

      expect(html).toContain('John Doe')
    })
  })
})

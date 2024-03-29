import { fileURLToPath } from 'node:url'
import { parse as parseCookie, encode as encodeCookie } from 'es-cookie'
import { describe, it, expect } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils-edge'
import { DEFAULT_API_PATH, getDefaultModuleOptions } from '../src/config'
import { signCookieId } from '../src/runtime/server/utils/signature'
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
      const cookieVal = parseCookie(headers.get('set-cookie') ?? '')[defaultOptions.name]
      const { prefix, length } = defaultOptions.genid

      expect(cookieVal.slice(0, prefix.length)).toEqual(prefix)
      expect(cookieVal.slice(prefix.length, cookieVal.indexOf('.')).length).toEqual(length)
    })

    it('Cookie options should be as secure as possible by default.', async () => {
      const { headers } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify({ name: 'John Doe' }) }
      )
      const cookieVal = parseCookie(headers.get('set-cookie') ?? '')
      const { name, cookie } = getDefaultModuleOptions()

      expect(cookieVal).toStrictEqual(getExpectedCookiesByOptions(name, cookie))
    })

    it('Cookie should not be regenerated for multiple requests.', async () => {
      const { name } = getDefaultModuleOptions()
      const { headers: resHeaders1 } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: { name: 'John Doe' } }
      )
      const cookie1 = parseCookie(resHeaders1.get('set-cookie') ?? '')[name]

      const { headers: resHeaders2 } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: { name: 'John Doe 2' }, headers: { cookie: resHeaders1.get('set-cookie') } }
      )
      const cookie2 = parseCookie(resHeaders2.get('set-cookie') ?? '')[name]

      expect(cookie1).toEqual(cookie2)
    })

    it('Cookie should be deleted for DELETE request.', async () => {
      const { headers: resHeaders1 } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: { name: 'John Doe' } }
      )

      const { headers: resHeaders2 } = await fetch(
        DEFAULT_API_PATH,
        { method: 'DELETE', headers: { cookie: resHeaders1.get('set-cookie') } }
      )
      const cookie = parseCookie(resHeaders2.get('set-cookie') ?? '')

      expect(cookie['Max-Age']).toStrictEqual('0')
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

    it('PUT api should be accessible by default.', async () => {
      const { headers } = await fetch(DEFAULT_API_PATH, { method: 'PUT' })
      expect(headers.get('content-type')).toEqual('application/json')
    })

    it('DELETE api should be accessible by default.', async () => {
      const { status } = await fetch(DEFAULT_API_PATH, { method: 'DELETE' })
      expect(status).toMatch(/^2[0-9]{2}$/)
    })

    it('Data from PATCH api should be accessible by GET api.', async () => {
      const patchData = { name: 'John Doe' }
      const { headers: patchResHeaders } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify(patchData) }
      )
      const getData = await $fetch(
        DEFAULT_API_PATH,
        { method: 'GET', headers: { cookie: patchResHeaders.get('set-cookie') ?? '' } }
      )

      expect(getData).toEqual(patchData)
    })

    it('Data from PUT request should replace all existing data.', async () => {
      const { headers: patchResHeaders } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify({ name: 'John Doe' }) }
      )
      const cookie = patchResHeaders.get('set-cookie') ?? ''
      const putData = { anotherName: 'John Another Doe' }
      await $fetch(
        DEFAULT_API_PATH,
        { method: 'PUT', body: putData, headers: { cookie } }
      )
      const getData = await $fetch(DEFAULT_API_PATH, { method: 'GET', headers: { cookie } })

      expect(getData).toEqual(putData)
    })

    it('DELETE request should delete session data.', async () => {
      const cookieId = 'cookie-id'
      await $fetch('/api/cookie-session/storage/' + cookieId, { method: 'POST', body: { data: 'John Doe' } })

      const { secret, genid: { prefix }, name } = getDefaultModuleOptions()
      const signedCookieId = await signCookieId(cookieId, secret, prefix)
      const headers = { cookie: encodeCookie(name, signedCookieId, {}) }

      await $fetch(DEFAULT_API_PATH, { method: 'DELETE', headers })

      const storageValue = await $fetch('/api/cookie-session/storage/' + cookieId, { headers })
      expect(storageValue).toBeFalsy()
    })
  })

  describe('pages', () => {
    it('Data should be rendered on server.', async () => {
      const patchData = { name: 'John Doe' }
      const { headers: patchResHeaders } = await fetch(
        DEFAULT_API_PATH,
        { method: 'PATCH', body: JSON.stringify(patchData) }
      )
      const html = await $fetch('/server-rendered-data', { headers: { cookie: patchResHeaders.get('set-cookie') ?? '' } })

      expect(html).toContain('John Doe')
    })
  })
})

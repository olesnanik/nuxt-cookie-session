import { defineNuxtPlugin } from '#app'
import { AccessModes, CookieSessionData } from '../types'

export default defineNuxtPlugin(() => {
  const { access } = useCookieSessionRuntimeConfig()
  const event = useRequestEvent()
  const cookie = event?.req.headers?.cookie
  const _data = event?.context.cookieSession?.data
  const data = access.mode === AccessModes.serverOnly
    ? ref(_data)
    : useState('cookieSession', () => _data)

  const updateData = async (newData: Partial<CookieSessionData>) => {
    data.value = await $fetch('/api/cookie-session', { method: 'PATCH', body: newData, headers: { cookie } })
  }

  return {
    provide: {
      cookieSession: { data, updateData }
    }
  }
})

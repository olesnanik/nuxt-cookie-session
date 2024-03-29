import type { HTTPMethod } from 'h3'
import { defineNuxtPlugin, useRequestEvent, useRuntimeConfig, showError } from '#app'
import { ref } from 'vue'
import type { CookieSessionData } from '../types'

export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  const data = ref(event?.context.cookieSession?.data ?? {})

  const { cookieSession: { api: { enable, path } } } = useRuntimeConfig()
  const handleRequestAndUpdateData = async (_request: () => ReturnType<typeof request>) => {
    if (!enable) {
      showError('Cookie session public API endpoints are disabled. Update config to enable it. `{ cookieSession: { api: enable: true } }`')
      return Promise.resolve({})
    }

    data.value = await _request()
    return data.value
  }

  const getData = () => handleRequestAndUpdateData(() => request(path))
  const patchData = (newData: Partial<CookieSessionData>) => handleRequestAndUpdateData(() => request(path, 'PATCH', newData))
  const putData = (newData: Partial<CookieSessionData>) => handleRequestAndUpdateData(() => request(path, 'PUT', newData))
  const deleteSession = () => handleRequestAndUpdateData(async () => {
    await request(path, 'DELETE')
    return {}
  })

  return {
    provide: {
      cookieSession: { data, patchData, getData, putData, deleteSession }
    }
  }
})

function request (
  path: string,
  method: Extract<HTTPMethod, 'GET' | 'PATCH' | 'PUT' | 'DELETE'> = 'GET',
  body?: Record<string, string>
): Promise<CookieSessionData> {
  const event = useRequestEvent()
  const cookie = event?.req.headers?.cookie ?? ''

  return $fetch(path, { method, body, headers: { cookie } })
}

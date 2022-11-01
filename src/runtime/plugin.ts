import type { HTTPMethod } from 'h3'
import { defineNuxtPlugin, useRequestEvent } from '#app'
import { ref } from 'vue'
import type { CookieSessionData } from '../types'

export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  const data = ref(event?.context.cookieSession?.data ?? {})

  const handleRequestAndUpdateData = async (_request: () => ReturnType<typeof request>) => {
    data.value = await _request()
    return data.value
  }

  const getData = () => handleRequestAndUpdateData(request)
  const patchData = (newData: Partial<CookieSessionData>) => handleRequestAndUpdateData(() => request('PATCH', newData))
  const putData = (newData: Partial<CookieSessionData>) => handleRequestAndUpdateData(() => request('PUT', newData))

  return {
    provide: {
      cookieSession: { data, patchData, getData, putData }
    }
  }
})

function request (
  method: Extract<HTTPMethod, 'GET' | 'PATCH' | 'PUT'> = 'GET',
  body?: Pick<Parameters<typeof $fetch>[1], 'body'>
): Promise<CookieSessionData> {
  const event = useRequestEvent()
  const cookie = event?.req.headers?.cookie

  const { api: { enable, path } } = useCookieSessionRuntimeConfig()
  if (!enable) {
    console.error('api option is not enabled')
    return Promise.resolve({})
  }

  return $fetch(path, { method, body, headers: { cookie } })
}

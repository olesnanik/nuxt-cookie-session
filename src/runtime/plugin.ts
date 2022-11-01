import type { HTTPMethod } from 'h3'
import { defineNuxtPlugin, useRequestEvent } from '#app'
import { ref } from 'vue'
import type { CookieSessionData } from '../types'

export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  const data = ref(event?.context.cookieSession?.data ?? {})

  const updateData = async (newData: Partial<CookieSessionData>) => {
    data.value = await request('PATCH', newData)
    return data.value
  }

  const fetchData = async () => {
    data.value = await request()
    return data.value
  }

  return {
    provide: {
      cookieSession: { data, updateData, fetchData }
    }
  }
})

function request (
  method: Extract<HTTPMethod, 'GET' | 'PATCH'> = 'GET',
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

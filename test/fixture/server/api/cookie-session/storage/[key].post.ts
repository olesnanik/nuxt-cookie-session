import { defineEventHandler, getRouterParams, readBody } from 'h3'
import { useCookieSessionStorage } from '../../../composables/useStorage'

export default defineEventHandler(async (event) => {
  const key = getRouterParams(event).key
  const body = await readBody(event)

  await useCookieSessionStorage().setItem(key, body)
  return ''
})

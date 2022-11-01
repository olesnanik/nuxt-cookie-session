import { defineEventHandler, getRouterParams } from 'h3'
import { useCookieSessionStorage } from '../../../composables/useStorage'

export default defineEventHandler((event) => {
  const key = getRouterParams(event).key

  return useCookieSessionStorage().getItem(key) ?? {}
})

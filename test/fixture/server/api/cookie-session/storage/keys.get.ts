import { defineEventHandler } from 'h3'
import { useCookieSessionStorage } from '../../../composables/useStorage'

export default defineEventHandler(() => {
  return useCookieSessionStorage().getKeys() ?? []
})

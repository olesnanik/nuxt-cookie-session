import { useRuntimeConfig } from '#imports'

export function useCookieSessionRuntimeConfig () {
  return useRuntimeConfig().cookieSession
}

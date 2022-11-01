import { useNuxtApp } from '#app'

export function useCookieSession () {
  return useNuxtApp().$cookieSession
}

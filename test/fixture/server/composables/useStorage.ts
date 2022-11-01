import { prefixStorage } from 'unstorage'

export function useCookieSessionStorage () {
  let storage = useStorage()
  const { cookieSession: { storage: storageOptions } } = useRuntimeConfig()
  storage = prefixStorage(storage, storageOptions.id)

  return storage
}

import { prefixStorage } from 'unstorage'
import { useCookieSessionRuntimeConfig } from './useRuntimeConfig'
// @ts-ignore
// eslint-disable-next-line import/named
import { useStorage } from '#imports'

export function useCookieSessionStorage () {
  let storage = useStorage()

  const config = useCookieSessionRuntimeConfig()
  if (config.storage) {
    const { id, keyPrefix } = config.storage
    storage = prefixStorage(storage, id)

    if (keyPrefix) {
      storage = prefixStorage(storage, keyPrefix)
    }
  }

  return storage
}

import { prefixStorage } from 'unstorage'
import { useCookieSessionRuntimeConfig } from './useRuntimeConfig'
/* eslint-disable */
// @ts-ignore
import { useStorage } from '#imports'
/* eslint-enable */

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

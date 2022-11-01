import { defineEventHandler, getRouterParams } from 'h3'
import { prefixStorage } from 'unstorage'

export default defineEventHandler(async (event) => {
  const key = getRouterParams(event).key

  let storage = useStorage()
  const { cookieSession: { storage: storageOptions } } = useRuntimeConfig()

  if (storageOptions?.id) {
    storage = prefixStorage(storage, storageOptions.id)
  }

  if (storageOptions?.keyPrefix) {
    storage = prefixStorage(storage, storageOptions.keyPrefix)
  }

  return await storage.getItem(key) ?? {}
})

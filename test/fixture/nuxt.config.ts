import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  cookieSession: {
    storage: {
      id: 'custom-storage'
    }
  },
  nitro: {
    storage: {
      'custom-storage': {
        driver: fileURLToPath(new URL('./custom-storage.mjs', import.meta.url))
      }
    }
  }
})

import { defineNuxtConfig } from 'nuxt/config'
import CookieSessionModule from '..'

export default defineNuxtConfig({
  modules: [
    [
      CookieSessionModule,
      {
        secret: 'secret',
        access: {
          mode: 'api'
        },
        storage: {
          id: 'my-storage'
        }
      }
    ]
  ]
})

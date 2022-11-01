import { defineNuxtConfig } from 'nuxt/config'
import CookieSessionModule from '..'

export default defineNuxtConfig({
  modules: [
    [
      CookieSessionModule,
      {}
    ]
  ]
})

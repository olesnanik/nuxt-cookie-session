import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defu } from 'defu'
import { defineNuxtModule, addPlugin, addImportsDir, addServerHandler, useLogger } from '@nuxt/kit'
import { ModuleOptions, CookieSessionRuntimeConfig } from './types'
import { CONFIG_KEY, getDefaultModuleOptions, LOG_MESSAGES } from './config'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'cookie-session',
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: getDefaultModuleOptions(),
  setup (options, nuxt) {
    const runtimeOptions = defu(options, getDefaultModuleOptions()) as CookieSessionRuntimeConfig
    if (runtimeOptions.secret === getDefaultModuleOptions().secret && nuxt.options.dev) {
      useLogger().warn(LOG_MESSAGES.defaultSecret)
    }

    nuxt.options.runtimeConfig.cookieSession = {
      storage: runtimeOptions.storage,
      genid: runtimeOptions.genid,
      secret: runtimeOptions.secret,
      name: runtimeOptions.name,
      api: runtimeOptions.api,
      cookie: runtimeOptions.cookie
    }

    nuxt.options.runtimeConfig.public.cookieSession = {
      api: runtimeOptions.api
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    addPlugin(resolve(runtimeDir, 'plugin'))

    const contextMiddleware = resolve(runtimeDir, 'server/middleware/context')
    nuxt.options.serverHandlers.unshift({ middleware: true, handler: contextMiddleware })

    addImportsDir(resolve(runtimeDir, 'server/composables'))
    addImportsDir(resolve(runtimeDir, 'composables'))

    if (runtimeOptions.api.enable) {
      ['GET', 'PATCH', 'PUT', 'DELETE'].map(method => addServerHandler({
        handler: resolve(runtimeDir, 'server/api/cookie-session.' + method.toLowerCase()),
        route: runtimeOptions.api.path
      }))
    }
  }
})

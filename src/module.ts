import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addImportsDir, addServerHandler, useLogger } from '@nuxt/kit'
import { ModuleOptions } from './types'
import { CONFIG_KEY, getDefaultModuleOptions, LOG_MESSAGES } from './config'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'cookie-session',
    configKey: CONFIG_KEY
  },
  defaults: getDefaultModuleOptions(),
  setup (options: ReturnType<typeof getDefaultModuleOptions>, nuxt) {
    if (options.secret === getDefaultModuleOptions().secret && nuxt.options.dev) {
      useLogger().warn(LOG_MESSAGES.defaultSecret)
    }

    nuxt.options.runtimeConfig.cookieSession = {
      storage: options.storage,
      genid: options.genid,
      secret: options.secret,
      name: options.name,
      api: options.api,
      cookie: options.cookie
    }

    nuxt.options.runtimeConfig.public.cookieSession = {
      api: options.api
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    addPlugin(resolve(runtimeDir, 'plugin'))

    const contextMiddleware = resolve(runtimeDir, 'server/middleware/context')
    nuxt.options.serverHandlers.unshift({ middleware: true, handler: contextMiddleware })

    addImportsDir(resolve(runtimeDir, 'server/composables'))
    addImportsDir(resolve(runtimeDir, 'composables'))

    if (options.api.enable) {
      ['GET', 'PATCH', 'PUT'].map(method => addServerHandler({
        handler: resolve(runtimeDir, 'server/api/cookie-session.' + method.toLowerCase()),
        route: options.api.path
      }))
    }
  }
})

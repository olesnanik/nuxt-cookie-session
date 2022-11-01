import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addImportsDir, addServerHandler, useLogger } from '@nuxt/kit'
import { AccessModes, ModuleOptions, RuntimeApiAccessOptions } from './types'
import { CONFIG_KEY, DEFAULT_API_PATH, getDefaultModuleOptions, LOG_MESSAGES } from './config'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'cookie-session',
    configKey: CONFIG_KEY
  },
  defaults: getDefaultModuleOptions(),
  setup (options: ModuleOptions & ReturnType<typeof getDefaultModuleOptions>, nuxt) {
    if (options.secret === getDefaultModuleOptions().secret && nuxt.options.dev) {
      useLogger().warn(LOG_MESSAGES.defaultSecret)
    }

    if (options.access.mode === AccessModes.api && !options.access.api?.path?.length) {
      options.access.api = { path: DEFAULT_API_PATH }
    }

    nuxt.options.runtimeConfig.cookieSession = {
      storage: options.storage,
      genid: options.genid,
      secret: options.secret,
      name: options.name,
      access: options.access,
      cookie: options.cookie
    }

    nuxt.options.runtimeConfig.public.cookieSession = {
      access: options.access
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    addPlugin(resolve(runtimeDir, 'plugin'))

    const contextMiddleware = resolve(runtimeDir, 'server/middleware/context')
    nuxt.options.serverHandlers.unshift({ middleware: true, handler: contextMiddleware })

    addImportsDir(resolve(runtimeDir, 'server/composables'))
    addImportsDir(resolve(runtimeDir, 'composables'))

    if (options.access.mode === AccessModes.api) {
      ['GET', 'PATCH'].map(method => addServerHandler({
        handler: resolve(runtimeDir, 'server/api/cookie-session.' + method.toLowerCase()),
        route: (options.access as RuntimeApiAccessOptions).api.path
      }))
    }
  }
})

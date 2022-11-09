import { CookieSessionRuntimeConfig } from './types'

export const DEFAULT_API_PATH = '/api/cookie-session'

export function getDefaultModuleOptions (): CookieSessionRuntimeConfig {
  return {
    secret: 'default-secret',
    genid: {
      length: 21,
      prefix: 's:'
    },
    name: 'cookieSessionId',
    api: {
      enable: true,
      path: '/api/cookie-session'
    },
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    },
    storage: {
      id: 'cookie-session'
    }
  }
}

export const CONFIG_KEY = 'cookieSession'

export const LOG_MESSAGES = {
  defaultSecret: `Cookie session module is using the default secret for signing of cookie ids. Custom randomly generated secret should be used to obtain better security. The option should be configured at \`{ ${CONFIG_KEY}: { secret: "your secret goes here" } }\``,
  disabledApi: `Cookie session public API endpoints are disabled. Update config to enable it. \`{ ${CONFIG_KEY}: { api: enable: true } }\``
}

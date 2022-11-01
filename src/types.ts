import type { setCookie } from 'h3'
import type { Ref } from 'vue'

export type CookieSessionData = {
  [key: string]: any
}

export type CookieSessionMeta = Pick<Parameters<typeof setCookie>[3], 'secure' | 'httpOnly' | 'domain' | 'path' | 'sameSite' | 'expires'> & {
  originalMaxAge?: number
}

export type CookieSessionStorageValue = (CookieSessionData & { cookie: CookieSessionMeta }) | null

export type CookieSessionContext = {
  data: Ref<CookieSessionData>
  setData: (newData: CookieSessionData) => Promise<void>
  updateData: (newData: Partial<CookieSessionData>) => Promise<void>
}

declare module 'h3' {
  export interface H3EventContext {
    cookieSession?: CookieSessionContext
  }
}

export enum AccessModes {
  serverOnly = 'server-only',
  clientPayload = 'client-payload',
  api = 'api'
}

export type RuntimeApiAccessOptions = {
  mode: AccessModes.api,
  api: {
    path: string
  }
}

type RuntimeAccessOptions = {
  mode: AccessModes.serverOnly | AccessModes.clientPayload
} | RuntimeApiAccessOptions

export type CookieOptions = Pick<Parameters<typeof setCookie>[3], 'domain' | 'httpOnly' | 'maxAge' | 'path' | 'sameSite' | 'secure'>

export type StorageOptions = {
  id: string
  keyPrefix?: string
}

export type CookieSessionRuntimeConfig = {
  secret: string
  genid: {
    length: number
    prefix: string
  }
  name: string
  access: RuntimeAccessOptions
  cookie: Required<Pick<CookieOptions, 'httpOnly' | 'secure' | 'sameSite'>> & Omit<CookieOptions, 'httpOnly' | 'secure' | 'sameSite'>
  storage?: StorageOptions
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    cookieSession: CookieSessionRuntimeConfig
  }

  interface PublicRuntimeConfig {
    cookieSession: {
      access: RuntimeAccessOptions
    }
  }
}

export type ModuleOptions = {
  secret?: string
  name?: string
  genid?: {
    length?: number
    prefix?: string
  }
  access?: {
    mode?: AccessModes.serverOnly | AccessModes.clientPayload
  } | {
    mode?: AccessModes.api,
    api?: {
      path?: string
    }
  }
  storage?: StorageOptions
  cookie?: CookieOptions
}

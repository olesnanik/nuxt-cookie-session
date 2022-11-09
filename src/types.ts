import type { Ref } from 'vue'
import type { CookieSerializeOptions } from 'cookie-es'

export interface CookieSessionData {
  [key: string]: any
}

export type CookieSessionStorageValue = CookieSessionData | null

export type CookieSessionContext = {
  data: Ref<CookieSessionData>
  setData: (newData: CookieSessionData) => Promise<void>
  updateData: (newData: Partial<CookieSessionData>) => Promise<void>
  deleteSession: () => Promise<void>
}

declare module 'h3' {
  export interface H3EventContext {
    cookieSession?: CookieSessionContext
  }
}

export type CookieOptions = Pick<CookieSerializeOptions, 'domain' | 'httpOnly' | 'maxAge' | 'path' | 'sameSite' | 'secure'>

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
  api: {
    enable: boolean
    path: string
  }
  cookie: Required<Pick<CookieOptions, 'httpOnly' | 'secure' | 'sameSite'>> & Omit<CookieOptions, 'httpOnly' | 'secure' | 'sameSite'>
  storage: StorageOptions
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    cookieSession: CookieSessionRuntimeConfig
  }

  interface PublicRuntimeConfig {
    cookieSession: Pick<CookieSessionRuntimeConfig, 'api'>
  }
}

export type ModuleOptions = {
  secret?: string
  name?: string
  genid?: {
    length?: number
    prefix?: string
  }
  api?: {
    enable?: boolean
    path?: string
  }
  storage?: StorageOptions
  cookie?: CookieOptions
}

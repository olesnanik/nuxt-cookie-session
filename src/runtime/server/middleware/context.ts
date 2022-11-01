import { H3Event, setCookie, parseCookies, defineEventHandler } from 'h3'
import { nanoid } from 'nanoid'
import { ref } from 'vue'
import type {
  CookieSessionData,
  CookieSessionMeta,
  CookieSessionStorageValue
} from '../../../types'
import { unsignCookieId, signCookieId } from '../utils/signature'
import { useCookieSessionRuntimeConfig } from '../composables/useRuntimeConfig'
import { useCookieSessionStorage } from '../composables/useStorage'

export default defineEventHandler(async (event: H3Event) => {
  const storage = useCookieSessionStorage()
  const storageReservedKeys = ['cookie']

  const cookieMeta = ref<CookieSessionMeta>({})
  const data = ref<CookieSessionData>({})

  let cookieId = await getCookieIdByEvent(event)
  if (cookieId) {
    const storageValue = (await storage.getItem(cookieId)) as CookieSessionStorageValue
    if (storageValue) {
      cookieMeta.value = storageValue.cookie ?? {}

      storageReservedKeys.forEach((key) => {
        if (storageValue[`_${key}`]) {
          storageValue[key] = storageValue[`_${key}`]
        }
        delete storageValue[`_${key}`]
      })
      data.value = storageValue
    }
  }

  const setCookieIfEmpty = async () => {
    if (!cookieId) {
      cookieId = generateCookieId()
      await setCookieIdByEvent(event, cookieId)
    }
  }

  const setData = async (newData: CookieSessionData) => {
    Object.keys(newData).forEach((key) => {
      if (storageReservedKeys.includes(key)) {
        newData[`_${key}`] = newData[key]
        delete newData[key]
      }
    })
    data.value = newData
    await setCookieIfEmpty()
  }

  const updateData = (newData: Partial<CookieSessionData>) => setData({ ...data.value, ...newData })

  event.context.cookieSession = {
    data,
    setData,
    updateData
  }

  event.res.on('finish', async () => {
    if (!Object.keys(data.value).length) {
      return
    }

    if (!cookieId) {
      throw new Error('cookieId has not been set during request')
    }
    const storageValue: CookieSessionStorageValue = { ...data.value, cookie: cookieMeta.value }
    await storage.setItem(cookieId, storageValue)
  })
})

function getCookieIdByEvent (event: H3Event): Promise<string | false> {
  const { name, secret, genid: { prefix } } = useCookieSessionRuntimeConfig()
  const currentCookie = parseCookies(event)[name]

  return currentCookie ? unsignCookieId(currentCookie, secret, prefix) : Promise.resolve(false)
}

function generateCookieId (): string {
  const { genid: { length } } = useCookieSessionRuntimeConfig()

  return nanoid(length)
}

async function setCookieIdByEvent (event: H3Event, cookieId: string): Promise<void> {
  const { name, secret, genid: { prefix }, cookie } = useCookieSessionRuntimeConfig()

  return setCookie(event, name, await signCookieId(cookieId, secret, prefix), cookie)
}

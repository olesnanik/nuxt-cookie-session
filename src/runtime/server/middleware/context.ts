import { H3Event, setCookie, parseCookies, defineEventHandler } from 'h3'
import { nanoid } from 'nanoid'
import { ref } from 'vue'
import type { CookieSessionData, CookieSessionStorageValue } from '../../../types'
import { unsignCookieId, signCookieId } from '../utils/signature'
import { useCookieSessionRuntimeConfig } from '../composables/useRuntimeConfig'
import { useCookieSessionStorage } from '../composables/useStorage'

export default defineEventHandler(async (event: H3Event) => {
  const storage = useCookieSessionStorage()
  const data = ref<CookieSessionData>({})

  let cookieId = await getCookieIdByEvent(event)
  if (cookieId) {
    const [storageValue] = await Promise.all([
      storage.getItem(cookieId) as CookieSessionStorageValue,
      setCookieIdByEvent(event, cookieId)
    ])
    if (storageValue) {
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

    if (cookieId) {
      await storage.setItem(cookieId, data.value)
    } else {
      throw new Error('cookieId has not been set during request')
    }
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

const SIGNATURE_DELIMETER = '.'

export const signCookieId = async (id: string, secret: string, prefix: string) =>
  `${prefix}${id}${SIGNATURE_DELIMETER}${await sign(id, secret)}`

export const unsignCookieId = async (id: string, secret: string, prefix: string) => {
  if (!id.startsWith(prefix)) {
    return false
  }

  id = id.slice(prefix.length)
  const [val, signature] = id.split(SIGNATURE_DELIMETER)

  if (!val?.length || !signature?.length) {
    return false
  }

  return await verify(val, signature, secret) ? val : false
}

const sign = async (val: string, secret: string) => {
  const key = await makeCryptoKey(secret)
  const subtle = await getSubtleCrypro()
  const signature = await subtle.sign(getAlgorithm().name, key, new TextEncoder().encode(val))
  return _btoa(String.fromCharCode(...new Uint8Array(signature)))
}

const verify = async (val: string, signature: string, secret: string) => {
  const key = await makeCryptoKey(secret)
  const subtle = await getSubtleCrypro()
  return await subtle.verify(
    getAlgorithm().name,
    key,
    stringToArrayBuffer(_atob(signature)),
    new TextEncoder().encode(val)
  )
}

const makeCryptoKey = async (secret: string) =>
  (await getSubtleCrypro())
    .importKey(
      'raw',
      new TextEncoder().encode(secret),
      getAlgorithm(),
      false,
      ['sign', 'verify']
    )

/**
 * For support of nodejs <= 14, use https://github.com/tj/node-cookie-signature
 * @returns SubtleCrypto
 */
const getSubtleCrypro = async () => {
  if (globalThis.crypto?.subtle) {
    // browser + nodejs >= 19
    return globalThis.crypto.subtle
  } else {
    // nodejs >= 15
    const crypto = await import('crypto')
    return crypto.webcrypto.subtle
  }
}

const getAlgorithm = () => ({ name: 'HMAC', hash: 'SHA-256' })

const stringToArrayBuffer = (str: string) => {
  const array = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i)
  }
  return array.buffer
}

function _atob (val: string): string {
  if (isBufferSupported()) {
    return Buffer.from(val, 'base64').toString('binary')
  } else {
    return window.atob(val)
  }
}

function _btoa (val: string): string {
  if (isBufferSupported()) {
    return Buffer.from(val.toString(), 'binary').toString('base64')
  } else {
    return window.btoa(val)
  }
}

function isBufferSupported (): boolean {
  return typeof Buffer === 'function'
}

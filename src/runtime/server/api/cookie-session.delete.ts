import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  await event.context.cookieSession?.deleteSession()
  return event.context.cookieSession?.data.value ?? {}
})

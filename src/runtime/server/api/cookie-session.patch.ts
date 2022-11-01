import { eventHandler, readBody } from 'h3'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  // TODO: validator

  await event.context.cookieSession.setData({
    ...event.context.cookieSession.data.value,
    ...body
  })

  return event.context.cookieSession.data.value
})

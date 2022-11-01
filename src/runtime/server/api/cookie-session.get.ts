import { eventHandler } from 'h3'

export default eventHandler((event) => {
  return event.context.cookieSession.data.value
})

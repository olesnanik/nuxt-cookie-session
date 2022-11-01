import { eventHandler } from 'h3'

export default eventHandler((event) => {
  // console.log('event.context.cookieSession.data.value', event.context.cookieSession.data.value)
  return event.context.cookieSession.data.value
})

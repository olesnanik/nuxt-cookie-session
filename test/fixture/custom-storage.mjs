export default () => {
  const data = new Map()

  const mockedData = new Map()
  mockedData.set('cookie-id', { data: 'Mocked data for cookie-id.' })
  mockedData.set('prefix:cookie-id', { data: 'Mocked data for prefix:cookie-id.' })

  return {
    hasItem (key) {
      return data.has(key) || mockedData.has(key)
    },
    getItem (key) {
      return data.get(key) || mockedData.get(key) || null
    },
    setItem (key, value) {
      data.set(key, value)
    },
    removeItem (key) {
      data.delete(key)
    },
    getKeys () {
      return Array.from(...data.keys())
    },
    clear () {
      data.clear()
    },
    dispose () {
      data.clear()
    }
  }
}

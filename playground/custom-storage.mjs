export default () => {
  const data = new Map()

  return {
    hasItem (key) {
      console.log('hasItem', key)
      return data.has(key)
    },
    getItem (key) {
      console.log('getItem', key)
      return data.get(key) || null
    },
    setItem (key, value) {
      console.log('setItem', key, value)
      data.set(key, value)
    },
    removeItem (key) {
      console.log('removeItem', key)
      data.delete(key)
    },
    getKeys () {
      console.log('getKeys')
      return Array.from(data.keys())
    },
    clear () {
      console.log('clear')
      data.clear()
    },
    dispose () {
      console.log('dispose')
      data.clear()
    }
  }
}

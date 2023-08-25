import b from './b.js'

const a = {
  value: 'a',
  getB: () => {
    return b.value + 'from a.js'
 }
}

export default a
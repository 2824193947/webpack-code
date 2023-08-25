import a from './a.js'

const b = {
  value: 'b',
  getA: () => {
    return a.value + 'from b.js'
  }
}

export default b
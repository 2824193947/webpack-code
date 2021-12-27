// style-loader 是为了将一段代码放到style标签中
const transform = code => `
  if (document) {
    const style = document.createElement('style')
    style.innerHTML = ${code}
    document.head.appendChild(style)
    module.exports = str
  }  
`

module.exports = transform
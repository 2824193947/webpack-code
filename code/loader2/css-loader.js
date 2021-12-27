// css-loader 只讲css转为 js 字符串 

// 不用 "${code}" 用 JSON.stringify(code) 是因为JSON.stringify会对一些回车 空格进行转译，不然会语法错误
// 可以看下控制台输出对比
//  consoloe.log("* {
//     |                ^
//   3 |  color: red
//   4 | }")
//   5 |  const str = "* {\n color: red\n}"
const transform  = code => {
  const str = JSON.stringify(code)
  return str
}
module.exports = transform
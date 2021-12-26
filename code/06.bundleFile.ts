import { writeFileSync, writevSync } from "fs"
import {depRelation, collectionCodeAndDeps} from './04.bundle'
import { resolve, relative, dirname } from 'path';
import { type } from "os";

const projectName = 'project_3'
const projectRoot = resolve(__dirname, projectName)
// 类型声明
type DepRelation = { key: string, deps: string[], code: string[]}
// 将入口文件的绝对路径传入函数，如 D://faiel/index.js
collectionCodeAndDeps(resolve(projectRoot, 'index.js'))

writeFileSync('dist.js', generatorCode())

function generatorCode() {
  let code = ''
  code += 'var depRelation = [' + depRelation.map(item => {
    const { key,deps, code } = item
    return `{
      key: ${JSON.stringify(key)},
      deps: ${JSON.stringify(deps)},
      code: function(require, moudle, exports) {
        ${code}
      }
    }`
  }).join(',') + '];\n'
  code += 'var moudel = {}\n'
  code += 'execute(depRlation[0].key)\n'
  code = `
    function execute(key) {
      if (moudles[key]) { return moudles[key]}
      var item = depRelation.find(i => i.key === key)
      if (!item) { throw new Error(\`\${item} is not found\`) }
      var pathToley = (path) => {
        var dirname = key.substring(0, key.lastIndexOf('/') + 1)
        var projectPath = (dirname + path).replace(\/\\.\\\/\/g, '').replace(\/\\\/\\\/\/, '/')
        return projectPath
      }
      var require = (path) => {
        return execute(pathToley(path))
      }
      moudles[key] = { __esModule: true }
      var moudle = { exports: moudles[key]}
      item.code(require, moudle, moudle.exports)
      return moudles[key]
    }
  `
  return code
}
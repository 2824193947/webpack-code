/**
 * 运行 ts-node code/06.bundleFile.ts
 */
import { writeFileSync, writevSync } from "fs"
import { resolve, relative, dirname, join } from 'path';
import { mkdir } from 'shelljs'
import * as babel from '@babel/core';
import { parse } from "@babel/parser";
import traverse from '@babel/traverse'
import { readFileSync } from 'fs'
import SimpleHtmlPlugin from './plugin/html-plugin'

const projectName = 'project_3'
const projectRoot = resolve(__dirname, projectName)

type DepRelation = {
  key: string,
  deps: string[],
  code: string
}[]

type Item = {
  key: string,
  deps: string[],
  code: string
}

// 初始化手机依赖的数组
// 类型声明
// 将入口文件的绝对路径传入函数，如 D://faiel/index.js
const depRelation: DepRelation = []
collectionCodeAndDeps(resolve(projectRoot, 'index.js'))
console.log("~ depRelation", depRelation)

const dir = `../${projectName}_dist`
mkdir('-p', dir)
writeFileSync(join(dir, 'dist.js'), generatorCode())

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
  code += 'var moudles = {}\n'
  code += 'execute(depRelation[0].key)\n'
  code += `
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

// 打包器
function collectionCodeAndDeps(failPath: string) {
  // 文件的项目
  const key = getProjectPath(failPath)
  /**
 * 解决循环依赖(DepRelation的key是所有index（索引）到的文件)
 */
  if (depRelation.find(i => i.key === key)) {
    return
  }
  // 获取文件内容
  let code = readFileSync(failPath).toString()
  /**
  * 这里是我们本次文件新加的处理css文件代码
  */
  if (/\.css$/.test(failPath)) {
    code = require('./loader2/css-loader.js')(code)
    code = require('./loader2/style-loader.js')(code)
  }
  // 转换为es5(本次改动点)
  const { code: es5Code }: any = babel.transform(code, {
    presets: ['@babel/preset-env']
  })
  
  // 初始化 depRealation[key]
  const item: Item = {key, deps: [], code: es5Code}

  depRelation.push(item)

  // 将代码转为Ast
  const ast = parse(code, {sourceType: 'module'})
  // 分析遍历
  traverse(ast, {
    enter: path => {
      if (path.node.type === 'ImportDeclaration') {
        // item.node.source.value 是一个相对路径 如: ./a.js
        const depAbsoutePath = resolve(dirname(failPath), path.node.source.value)
        
        // 然后转译为项目路径
        const depProjectPath = getProjectPath(depAbsoutePath)
        // 将依赖装入DepRelation
        item.deps.push(depProjectPath)
        /**
       * 解决嵌套依赖
       */
        collectionCodeAndDeps(depAbsoutePath)
      }
    }
  })
}

function getProjectPath(path: string) {
  return relative(projectRoot, path).replace(/\\/g, '/')
}

const htmlplug = new SimpleHtmlPlugin({
    title: 'yes',
    dir
})

htmlplug.apply()


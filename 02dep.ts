import { parse } from "@babel/parser";
import traverse from '@babel/traverse'
import { readFileSync } from 'fs'
// resolve 拼接路径  /Users/didi/Desktop/test/webpack-code/project_2/index.js
// relative 得到最后  index.js
// dirname 得到前面的路径  /Users/didi/Desktop/test/webpack-code/project_2
import { resolve, relative, dirname } from 'path';

// 当前目录
const projectRoot = resolve(__dirname, 'project_2')

// 类型声明
/**
 * key 代表文件
 * deps 存储文件中依赖文件
 * code 存储代码
 */
type DepRelation = {
  [key: string]: {
    deps: string[],
    code: string
  }
}

// 初始化手机依赖的数组
const DepRelation: DepRelation = {}

// 将入口文件传入到函数中
collectionCodeAndDeps(resolve(projectRoot, 'index.js'))

console.log(DepRelation);


function collectionCodeAndDeps(failPath: string) {
  // 文件的项目
  const key = getProjectPath(failPath)
  // 获取文件内容
  const code = readFileSync(failPath).toString()
  // 初始化 depRealation[key]
  DepRelation[key] = {deps: [], code: code}
  // 将代码转为Ast
  const ast = parse(code, {sourceType: 'module'})
  // 分析遍历
  traverse(ast, {
    enter: item => {
      if (item.node.type === 'ImportDeclaration') {
        // item.node.source.value 是一个相对路径 如: ./a.js
        const depAbsoutePath = resolve(dirname(failPath), item.node.source.value)
        
        // 然后转译为项目路径
        const depProjectPath = getProjectPath(depAbsoutePath)
        // 将依赖装入DepRelation
        DepRelation[key].deps.push(depProjectPath)
        // ***这句代码是为了解决嵌套依赖***
        collectionCodeAndDeps(depAbsoutePath)
      }
    }
  })
}

function getProjectPath(path: string) {
  return relative(projectRoot, path).replace(/\\/g, '/')
}
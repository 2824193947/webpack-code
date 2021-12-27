/**
 * 本次解决问题：
 * 1. 打包为dist文件, dist文件就是将所有文件包含在内, 
 * 2. 不在需要像index.js需要依赖其他文件, 而在dist文件中式全部包含所有文件的, 
 * 3. 然后执行所有模块, 所有文件放到一个文件,再执行, 这个就是打包bundel
 * 运行 ts-node code/04.bundle.ts
 */
 import * as babel from '@babel/core';
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
 const depRelation: DepRelation = []
 
 // 将入口文件传入到函数中
 collectionCodeAndDeps(resolve(projectRoot, 'index.js'))
 
 console.log("~ DepRelation", depRelation)
 

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
   const code = readFileSync(failPath).toString()
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
 // 获取路径
 function getProjectPath(path: string) {
   return relative(projectRoot, path).replace(/\\/g, '/')
 } 
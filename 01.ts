// 首先下载这些包
// 但是这些包可能下载的时候名字有变化，已经更新了，最新版才是ts，去npm搜下吧
// 1. 引入
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generator from '@babel/generator'

// 2. 我们写一句代码
let code = `let a = 'let';let b = '33'`

// 3. 转为ast语法树
const ast = parse(code, {sourceType: 'module'})

// 4. 遍历ast语法树
traverse(ast, {
// item 是遍历的每一项
  enter: item => {
  // 找到遍历的每一项中的VariableDeclaration这个类型
    if (item.node.type === 'VariableDeclaration') {
    // 找到item中的kind，将let改为var
      if (item.node.kind === 'let') {
        item.node.kind = 'var'
      }
    }
  }
});

// 5. 将语法树转换回去
let code2 = generator(ast, {}, code) 

console.log(code2)
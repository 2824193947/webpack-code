import { parse } from "@babel/parser";
import traverse from '@babel/traverse'
import { readFileSync } from 'fs'
import { resolve, relative, dirname } from 'path';

// 当前目录
const projectRoot = resolve(__dirname, 'project_2')
console.log("~ projectRoot",projectRoot )

// 类型声明
type DepRelation = {
  [key: string]: {
    deps: string[],
    code: string
  }
}

// 初始化手机依赖的数组
const DepRelation: DepRelation = {}

// 
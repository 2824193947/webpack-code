# code文件夹下

## webpack源码学习

## 利用node, 通过浏览器调试代码:

eg: node --inspect-brk ./node_modules/webpack-cli/bin/cli.js

### 01 转换代码

#### 02 找出依赖文件 解决嵌套依赖 解决循环依赖

#### perject_02 和 02ts对应

#### 03 转译代码（平稳的兼容策略（解决办法）： 转译代码，将所有文件打包为一个文件）

#### 04 （打包器）将所有文件打包为一个文件（平稳的兼容策略（解决办法）： 转译代码，将所有文件打包为一个文件）

- 这里的文件将会打包为一个文件,  然后去执行他

#### 05 手写一个dist文件 （dist文件就是包含所有打包后的代码，里面的code是函数然后执行函数得到结果）

#### 07 这个文件作用是生成dist文件，加上04文件的打包器，就可以输出自动输出dist

- 那么这里发现只可以解决打包js文件，css呢？ 那么就是去将css转化为js，那么就可以加载了
- 我们建立了一个loader的文件夹，实现了css-loader，就是将css，变为js引入

#### 08 对前面的loader进行优化 loader2（单一职责原则）

- webpack 里每个loader只做一件事情 现在loader文件中做了两件事 1.转字符串 和 2.代码扔到dom中
- 目前我的loader做了两件事
- 1. 将css转化为js字符串


# code2文件 补充

## webpack源码学习补充

#### 01 了解到node.js可以使用import文件, 需要文件名是.mjs文件

#### https://astexplorer.net/ 这个网站列举了诸多语言的解析器(Parser)，及转化器(Transformer)。

#### 02 之前是手写了一个webpack(打包器) 这次看一下联系玩一下 webpack 的 api 以及看一下 输出的代码 (build.js, build2.js, )

- 和之前手写的code/05.dist.js文件一样: 这里给出一个易于理解dist文件结构的例子

```java
const __webpack_modules__ = [() => {}];
const __webpack_require__ = (id) => {
  const module = { exports: {} };
  const m = __webpack_modules__[id](module, __webpack_require__);
  return module.exports;
};

__webpack_require__(0);
```

#### 03 code spliting 如果使用import函数, 会根据注释分块, 经常用到的vue路由组件动态加载

#### 04/05 体验加载json, 图片

#### 06 style-loader html-webpack-plugin (创建html文件并自动引入dist文件)

#### 07 webpack-server 热更新

-HMR，Hot Module Replacement，热模块替换，见名思意，即无需刷新在内存环境中即可替换掉过旧模块。与 Live Reload 相对应。

-PS: Live Reload，当代码进行更新后，在浏览器自动刷新以获取最新前端代码。

-在 webpack 的运行时中 __webpack__modules__ 用以维护所有的模块。

-而热模块替换的原理，即通过 chunk 的方式加载最新的 modules，找到 __webpack__modules__ 中对应的模块逐一替换，并删除其上下缓存。

#### 08 swc 加速

- 在 webpack 中耗时最久的当属负责 AST 转换的 loader。
- 当 loader 进行编译时的 AST 操作均为 CPU 密集型任务，使用 Javascript 性能低下，此时可采用高性能语言 rust 编写的 swc。










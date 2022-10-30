/**
 * 这个文件是模仿dist打包文件（dist文件就是将project_3的index.js去转化降级打包为一个文件）
 * depRelation是babel转译后的代码
 * https://www.dvy.com.cn/2020/12/06/6976.html 这个博客有babel的转译后代码的讲解
 */
var depRelation =[
  {
    key: 'index.js',
    deps: ['a.js', 'b.js'],
    code: function(require, module, exports) {
      "use strict";
      // 这里就是bable转译的代码，inport转化为require  _interopRequireDefault是为了做转化
      var _a = _interopRequireDefault(require("./a.js"))
      var _b = _interopRequireDefault(require("./b.js"))
      // _interopRequireDefault的作用就是判断require的模块是否是已经被babel编译过的模块，如果是，则当前require的引用一定存在一个default属性；否则为他加一个default属性，这样便不会调用模块的default为undefined的情况了
      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj}}
      // _a["default"]就是调用a文件默认导出default
      console.log(_a["default"].getB());
      console.log(_b["default"].getA());
    }
  },
  {
    key: 'a.js',
    deps: ['b.js'],
    code: function(require, module, exports) {
      "use strict";
      // 这里就是bable转译的代码，inport转化为require  _interopRequireDefault是为了做转化
      Object.defineProperty(exports, "__esModule", {
        value: true
      })
      exports["default"] = void 0;
      var _b = _interopRequireDefault(require("./b.js"))
      // _interopRequireDefault的作用就是判断require的模块是否是已经被babel编译过的模块，如果是，则当前require的引用一定存在一个default属性；否则为他加一个default属性，这样便不会调用模块的default为undefined的情况了
      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj}}

      var a = {
        value: 'a',
        getB: function () {
          return _b["default"].value + 'from a.js'
        }
      }
      var _default = a
      exports['default'] = _default
    }
  },
  {
    key: 'b.js',
    deps: ['a.js'],
    code: function(require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      })
      exports["default"] = void 0;
      // 这里就是bable转译的代码，inport转化为require  _interopRequireDefault是为了做转化
      var _a = _interopRequireDefault(require("./a.js"))
      // _interopRequireDefault的作用就是判断require的模块是否是已经被babel编译过的模块，如果是，则当前require的引用一定存在一个default属性；否则为他加一个default属性，这样便不会调用模块的default为undefined的情况了
      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj}}

      var b = {
        value: 'b',
        getA: function () {
          return _a["default"].value + 'from b.js'
        }
      }
      var _default = b
      exports['default'] = _default
    }
  }
]
var moudles = {}
execute(depRelation[0].key)
function execute(key) {
  // 缓存 如果已经 require 过，直接返回上次的结果
  if (moudles[key]) { return moudles[key]}
  // 找到要执行的项目
  var item = depRelation.find(i => i.key === key)
  // 找不到就报错，中断执行
  if (!item) { throw new Error(`${item} is not found`) }
  // 把相对路径变为项目路径
  var pathToley = (path) => {
    var dirname = key.substring(0, key.lastIndexOf('/') + 1)
    var projectPath = (dirname + path).replace(/\.\//g, '').replace(/\/\//, '/')
    return projectPath
  }
  // require 函数
  var require = (path) => {
    return execute(pathToley(path))
  }
  // 初始化当前模块
  moudles[key] = { __esModule: true }
  var moudle = { exports: moudles[key]}
  // 初始化 moudel 方便 code 在 moudel.exports 导出属性
  // 第二个参数moudel ，大部分无用，用于兼容旧代码
  item.code(require, moudle, moudle.exports)
  // 返回当前模块
  return moudles[key]
}
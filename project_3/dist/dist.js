var depRelation = [{
      key: "index.js",
      deps: ["a.js","b.js","01.css"],
      code: function(require, moudle, exports) {
        "use strict";

var _a = _interopRequireDefault(require("./a.js"));

var _b = _interopRequireDefault(require("./b.js"));

require("./01.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_a["default"].getB());
console.log(_b["default"].getA());
      }
    },{
      key: "a.js",
      deps: ["b.js"],
      code: function(require, moudle, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _b = _interopRequireDefault(require("./b.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var a = {
  value: 'a',
  getB: function getB() {
    _b["default"].value + 'from a.js';
  }
};
var _default = a;
exports["default"] = _default;
      }
    },{
      key: "b.js",
      deps: ["a.js"],
      code: function(require, moudle, exports) {
        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _a = _interopRequireDefault(require("./a.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var b = {
  value: 'b',
  getA: function getA() {
    _a["default"].value + 'from b.js';
  }
};
var _default = b;
exports["default"] = _default;
      }
    },{
      key: "01.css",
      deps: [],
      code: function(require, moudle, exports) {
        "use strict";

console.log("* {\n color: red\n}");
console.log(code);
var str = "* {\n color: red\n}";

if (document) {
  var style = document.createElement('style');
  style.innerHTML = str;
  document.head.appendChild(style);
  module.exports = str;
}
      }
    }];
var moudles = {}
execute(depRelation[0].key)

    function execute(key) {
      if (moudles[key]) { return moudles[key]}
      var item = depRelation.find(i => i.key === key)
      if (!item) { throw new Error(`${item} is not found`) }
      var pathToley = (path) => {
        var dirname = key.substring(0, key.lastIndexOf('/') + 1)
        var projectPath = (dirname + path).replace(/\.\//g, '').replace(/\/\//, '/')
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
  
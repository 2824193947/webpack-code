const webpack = require('webpack')
const path = require('path')

// `webpack-cli` 与 `webpack/cli` 调来调去，逻辑复杂，为了方便，直接使用其 node api 进行示例，方便调试

// 1. webpack 的运行时代码分析
// 2. output.filename template
// 3. [contenthash].js 中的 hash 是如何生成的
// 4. [id] 与 [name] 是如何生成的
// 5. 试试 mode 为 production/development/none 时运行时代码有何不同
// 6. output.path 如何指定打包目录为 build 目录
// 7. devtool 对运行时有何影响
// 8. sourcemap 的工作原理是什么样的

// webpack 的运行时代码分析 输出文件默认 dist/main.js
function f1() {
    return webpack({
        entry: './src/index.js', // 这些是webpack配置可以看官网配置
        mode: 'none',
        output: {
            iife: false, // https://webpack.docschina.org/configuration/output/#outputiife
            pathinfo: true // https://webpack.docschina.org/configuration/output/#outputpathinfo
        }
    })
}

// webpack 的 runtimeChunk 单独分离，默认打包文件为 runtime~main.js
// 阅读 runtimeChunk 代码，它代表什么意思？可留在 chunk 篇时继续理解
// 输出文件默认 runtime~main.js
function f2() {
    return webpack({
        entry: './src/index.js',
        mode: 'none',
        optimization: {
            runtimeChunk: true,
        }
    })
}

function f3() {
    return webpack([
        {
            entry: './src/index.js',
            mode: 'production',
            output: {
                filename: 'main.production.js'
            }
        },
        {
            entry: './src/index.js',
            mode: 'development',
            output: {
                filename: 'main.development.js'
            }
        },
        {
            entry: './src/index.js',
            output: {
                filename: 'main.unknown.js'
            }
        }
    ])
}

// [contenthash] 中 hash 是如何生成的，使用了哪种 hash 算法？
// 嗯对，现在 webpack 已经支持了数组选项，见 https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations
function f4() {
    return webpack([
        {
            entry: './src/index.js',
            mode: 'none',
            output: {
                filename: 'main.[contenthash].js'
            }
        }, {
            entry: './src/index.js',
            mode: 'none',
            output: {
                filename: 'main.[contenthash:6].js'
            }
        }
    ])
}

// [contenthash] 中 hash 是如何生成的，使用了哪种 hash 算法？
// webpack 默认使用 md4 算法，webpack v5.54.0+ 后，支持 xxhash64 算法，比 md4 算法更快
// 见：https://webpack.js.org/configuration/experiments/#experimentsfuturedefaults
// > You can provide a non-crypto hash function for performance reasons.
function f5() {
    return webpack([
        {
            entry: './src/index.js',
            mode: 'none',
            output: {
                filename: 'main.[contenthash:6].md4.js',
                hashFunction: 'md4'
            }
        }, {
            entry: './src/index.js',
            mode: 'none',
            output: {
                filename: 'main.[contenthash:6].xxhash64.js',
                hashFunction: 'xxhash64'
            }
        }
    ])
}


// 修改导出文件名称默认是dist
function f6() {
    return webpack({
        entry: './src/index.js',
        mode: 'none',
        output: {
            filename: '[name].[contenthash:8].js',
            path: path.resolve(__dirname, 'build'),
        }
    })
}

// output.publicPath 如何影响上线
// 好吧，在打包这里一点都不影响
function f7() {
    return webpack({
        entry: './src/index.js',
        mode: 'none',
        output: {
            publicPath: 'https://static.shanyue.tech'
        }
    })
}

// 将 runtime 专门打包到 dist/runtime 路径
function f8() {
    return webpack({
        entry: './src/index.js',
        mode: 'none',
        output: {
            filename: '[name].[contenthash:8].js',
            // output.path 必须为一个绝对路径
            path: path.resolve(__dirname, 'dist/runtime'),
        },
        optimization: {
            runtimeChunk: true,
        }
    })
}

// mode 为 development 时的 devtool 配置
// devtool 配置用来加强 debug 的配置
function f9() {
    return webpack([
        {
            entry: './src/index.js',
            mode: 'development',
            devtool: 'eval',
            output: {
                filename: 'main.eval.js'
            }
        },
        {
            entry: './src/index.js',
            mode: 'development',
            devtool: 'eval-source-map',
            output: {
                filename: 'main.eval-source-map.js'
            }
        }
    ])
}


function f10() {
    return webpack({
        entry: './src/index.js',
        mode: 'none',
        output: {
            filename: '[id]-[name]-[contenthash]-[chunkhash].js'
        }
    })
}

function f12() {
    return webpack({
        entry: './src/index.js',
        mode: 'none',
        output: {
            environment: {
                const: true,
                arrowFunction: false,
                forOf: true
            }
        }
    })
}

f1().run((err, start) => {
    console.log("🚀 ~ start", start)
    console.log("🚀 ~ err", err)
})

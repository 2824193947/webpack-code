const webpack = require('webpack')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const path = require('path')

const smp = new SpeedMeasurePlugin();

function f1() {
  return webpack({
    entry: "./index.js",
    mode: "none",
    // rules: [
    //   {
    //     test: /\.m?js$/,
    //     use: {
    //       loader: "swc-loader",
    //     },
    //   },
    // ],
    output: {
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [new MyPlugin(), new MyOtherPlugin()],
  });
}

f1().run((a, stats) => {
  console.log(
    "Time",
    stats.endTime - stats.startTime
  );
});

/*
 * @Author: your name
 * @Date: 2021-09-18 18:15:28
 * @LastEditTime: 2021-09-18 20:28:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-diff\webpack.config.js
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve, join } = require('path')

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/index.html")
    })
  ],
  devServer: {
  }
}
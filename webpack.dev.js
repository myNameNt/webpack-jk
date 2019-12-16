'use strict'
const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports =  {
  entry: {
    index: './src/index.js',
    super: './src/super.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          'style-loader', // 将样式通过style标签插入到head里面 -- 后
          'css-loader', // 加载.css 文件并且转化成commonjs对象 -- 先
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader', // 将样式通过style标签插入到head里面 -- 后
          'css-loader', // 加载.css 文件并且转化成commonjs对象 -- 先
          'less-loader' // 将less转化为css
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]'
            }
          }
        ]
      }, 
      {
        test: /.(woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
      filename: 'index.html',
      chunks: '[index]',
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new CleanWebpackPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
  // watch: true,
  // watchOptions: {
  //   ignored: /node_modules/, // 忽略不需要监听的文件夹
  //   aggregateTimeout: 300, // 监听到变化后，等300毫秒在取执行
  //   poll: 100 // 判断文件是否发生变化是通过不断的询问系统指定文件有没有变化实现的， 默认每秒询问1000次
  // }
}
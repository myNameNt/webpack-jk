'use strict'
const path = require('path')
const miniCssExtractPlugin = require('mini-css-extract-plugin') // css打包 chunk
const optimizeCssAssetsWebpackPlugin  = require('optimize-css-assets-webpack-plugin') // css 压缩
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
  mode: 'production',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          miniCssExtractPlugin.loader, // 和style.loader功能相冲突  这个插件是把css打包成一个文件， 而style.loader 是使用style标签直接加到html的head里面
          // 'style-loader', // 将样式通过style标签插入到head里面 -- 后
          'css-loader', // 加载.css 文件并且转化成commonjs对象 -- 先
        ]
      },
      {
        test: /.less$/,
        use: [
          miniCssExtractPlugin.loader, // 和style.loader功能相冲突  这个插件是把css打包成一个文件， 而style.loader 是使用style标签直接加到html的head里面
          // 'style-loader', // 将样式通过style标签插入到head里面 -- 后
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
              name: '[name]_[hash:8].[ext]'
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
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css' // 将css打包成一个独立文件
    }),
    new optimizeCssAssetsWebpackPlugin({ // 将css 代码压缩
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')  //  需要依赖的插件
    }),
    new htmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
      filename: 'index.html',
      chunks: '[index]',
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks:false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new CleanWebpackPlugin()
  ]
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin()
  // ],
  // devServer: {
  //   contentBase: './dist',
  //   hot: true
  // }
  // watch: true,
  // watchOptions: {
  //   ignored: /node_modules/, // 忽略不需要监听的文件夹
  //   aggregateTimeout: 300, // 监听到变化后，等300毫秒在取执行
  //   poll: 100 // 判断文件是否发生变化是通过不断的询问系统指定文件有没有变化实现的， 默认每秒询问1000次
  // }
}
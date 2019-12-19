'use strict'
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const projectRoot = process.cwd();
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      return htmlWebpackPlugins.push(
        new htmlWebpackPlugin({
          inlineSource: '.css$',
          template: path.join(projectRoot, `./src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['vendors', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        })
      );
    });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports =  {
  entry: {
    index: './src/index/index.js',
    super: './src/search/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[hash:8].js' // 启动了热更新的开发模式不能使用 chunkhash 
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
          {
            loader: 'px2rem-loader', // 这个loader需要放在less-loader 处理之后
            options: {
              remUnit: 75, // 表一个单位的rem是多少像素， 设置成75适合 750的设计稿
              remPrecision: 8,// 表示计算后的rem 保留小数点后多少位。
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: ()=>[
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          }
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader', // 将样式通过style标签插入到head里面 -- 后
          'css-loader', // 加载.css 文件并且转化成commonjs对象 -- 先
          {
            loader: 'px2rem-loader', // 这个loader需要放在less-loader 处理之后
            options: {
              remUnit: 75, // 表一个单位的rem是多少像素， 设置成75适合 750的设计稿
              remPrecision: 8,// 表示计算后的rem 保留小数点后多少位。
            }
          },
          'less-loader', // 将less转化为css
          {
            loader: 'postcss-loader',
            options: {
              plugins: ()=>[
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          }
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
    new CleanWebpackPlugin()
  ].concat(htmlWebpackPlugins),
  devServer: {
    contentBase: './dist',
    hot: true
  },
  devtool: 'source-map'
  // watch: true,
  // watchOptions: {
  //   ignored: /node_modules/, // 忽略不需要监听的文件夹
  //   aggregateTimeout: 300, // 监听到变化后，等300毫秒在取执行
  //   poll: 100 // 判断文件是否发生变化是通过不断的询问系统指定文件有没有变化实现的， 默认每秒询问1000次
  // }
}
'use strict'
const path = require('path')
const glob = require('glob')
const miniCssExtractPlugin = require('mini-css-extract-plugin') // css打包 chunk
const optimizeCssAssetsWebpackPlugin  = require('optimize-css-assets-webpack-plugin') // css 压缩
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin') // 将第三方包
const projectRoot = process.cwd();
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index-server.js'));
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index-server\.js/);
      const pageName = match && match[1];

      if (pageName) {
        entry[pageName] = entryFile;
        htmlWebpackPlugins.push(
          new htmlWebpackPlugin({
            inlineSource: '.css$',
            template: path.join(projectRoot, `./src/${pageName}/index.html`),
            filename: `${pageName}.html`,
            chunks: ['vendors', 'commons', pageName],
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
      }
    });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();
console.log(entry,'entry--')
module.exports =  {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-server.js',
    libraryTarget: 'umd'
  },
  mode: 'production', // 当mode的值为 none时就会关闭 tree shaking 功能 webpack 生产环境默认是开启了tree shaking的 tree shaking 的作用是去掉 代码中没有用到的代码。 （名字的由来就是，我们用力去摇一颗树的时候，树上的老的叶子会掉下来）
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
          'eslint-loader'
        ]
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
          {
            loader: 'px2rem-loader',
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
    new CleanWebpackPlugin(),
    
  ].concat(htmlWebpackPlugins, [
    // 使用该插件需要放在 htmlWebpackPlugins 后面
    // new HtmlWebpackExternalsPlugin({ // 将第三方包单独提取出来，使用cnd的方式加载
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://cdn.bootcss.com/react/16.10.2/cjs/react.development.js',
    //       global: 'React',
    //     },
    //   ],
    // })
  ]),
  optimization: { // 自带的分包工具 将不轻易变更的第三方包 提取出来合成一个vandors文件 有利于后续利用浏览器缓存 提升页面加载速度
    // splitChunks: {
    //   minSize: 0, // 引用的文件大于多少就将该文件提取出来  设置为0 时 只要别引用就提取出来
    //   cacheGroups: {
    //     commons: {
    //       test: /(react|react-dom)/,
    //       name: "vendors",
    //       chunks: "all"
    //     }
    //   },
    // }
    // splitChunks: { // 代码拆分和 懒加载模块有冲突， 但不知道为什么？
    //   minSize: 0,
    //   cacheGroups: {
    //     commons: { // 项目重复用到的模块 打包到一起
    //       name: 'commons',
    //       chunks: 'all',
    //       minChunks: 1,
    //       priority: 0 
    //     },
    //     vendors: {  // 项目用到的第三方包 打包到一起
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendors",
    //       chunks: "all",
    //       priority: 10
    //     },
    //   }
    // }
  },
  devtool: 'inline-source-map',
  stats: 'errors-only'// 再编译的时候 如何展示编译信息。 共有五种 error-only ==> 只在发生错误时输出  minmal ==> 只在发生错误时/ 或者有新的编译时输出   none ==> 不输出任何日志  normal ==> 标准输出  varbose ==> 全部输出
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
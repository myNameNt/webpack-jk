'use strict'

const path = require('path')
module.exports =  {
  entry: {
    index: './src/index.js',
    super: './src/super.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle-[name].js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      }
    ]
  }
}
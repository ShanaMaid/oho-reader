'use strict';
let path = require('path');
let defaultSettings = require('./defaults');

// Additional npm or bower modules to include in builds
// Add all foreign plugins you may need into this array
// @example:
// let npmBase = path.join(__dirname, '../node_modules');
// let additionalPaths = [ path.join(npmBase, 'react-bootstrap') ];
let additionalPaths = [];

module.exports = {
  additionalPaths: additionalPaths,
  host: defaultSettings.host,
  port: defaultSettings.port,
  debug: true,
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath,
    chunkFilename: '[name].[chunkhash:5].chunk.js'
  },
  devServer: {
    disableHostCheck: true,
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    host: defaultSettings.host,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false,
    chunkFilename: '[name].[chunkhash:5].chunk.js',
    proxy: {
      '/api': {
        target: 'http://api.zhuishushenqi.com/',
        pathRewrite: {'^/api' : '/'},
        changeOrigin: true
      },
      '/chapter': {
        target: 'http://chapter2.zhuishushenqi.com/',
        pathRewrite: {'^/chapter' : '/chapter'},
        changeOrigin: true
      }
   }
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      actions: `${defaultSettings.srcPath}/actions/`,
      components: `${defaultSettings.srcPath}/components/`,
      sources: `${defaultSettings.srcPath}/sources/`,
      stores: `${defaultSettings.srcPath}/stores/`,
      styles: `${defaultSettings.srcPath}/styles/`,
      config: `${defaultSettings.srcPath}/config/` + process.env.REACT_WEBPACK_ENV,
      'react/lib/ReactMount': 'react-dom/lib/ReactMount'
    }
  },
  module: {}
};

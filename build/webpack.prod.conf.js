var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var prod = '"' + (process.argv[2] || 'production') + '"';
var prodWebpackConfig = {
  module: {
    // loaders: utils.styleLoaders({ sourceMap: config.build.productionSourceMap, extract: true })
    loaders: utils.styleLoaders({ sourceMap: config.productionSourceMap, extract: true })
  },
  // devtool: config.build.productionSourceMap ? '#source-map' : false,
  devtool: config.productionSourceMap ? '#source-map' : false,
  output: {
    // filename: utils.assetsPath('js/[name].[chunkhash].js'),
    filename: utils.assetsPath('[name].[chunkhash].js'),
    // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    chunkFilename: utils.assetsPath('[id].[chunkhash].js')
  },
  vue: {
    loaders: utils.cssLoaders({
      // sourceMap: config.build.productionSourceMap,
      sourceMap: config.productionSourceMap,
      extract: true
    })
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: prod
      },
      // RUN_ENV: JSON.stringify('production')
      RUN_ENV: JSON.stringify(utils.env)
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    // extract css into its own file
    // new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
    new ExtractTextPlugin(utils.assetsPath('[name].[contenthash].css')),
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vue_vue-resource",
      // filename: utils.assetsPath('js/lib/commons.[chunkhash].js'),
      filename: utils.assetsPath('commons.[chunkhash].js'),
      // minChunks: 3,
    }),
    new webpack.ProvidePlugin({
      FastClick: 'fastclick',
      Vue: 'vue'
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: process.env.NODE_ENV === 'testing'
    //     ? 'index.html'
    //     : config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   }
    // })
  ]
}

var appConfig = require('../appConfig')

var chunks = {};
appConfig.pages.forEach(function(page) {

  if (page.chunks) {
    chunks[page.chunks] = chunks[page.chunks] || []
    chunks[page.chunks].push(page.filename)
  }

  var conf = {
    template: page.template || 'src/templates/vue.ejs',  // html模板路径
    title: page.title || '钱方商户',
    // filename: 'templates/' + page.filename + '.html', // 生成的html存放路径,文件名，相对于path
    filename: '' + page.filename + '.html', // 生成的html存放路径,文件名，相对于path
    chunks: [page.chunks, page.filename],
    inject: 'body',                         // //js插入的位置
    hash: false,
    minify: {   // 压缩HTML文件
      removeComments: true,       // 移除HTML中的注释
      collapseWhitespace: false,   // 删除空白符与换行符
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    RUN_ENV: utils.env
  }
  // https://github.com/ampedandwired/html-webpack-plugin
  prodWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
});

// console.log('chunks:', chunks)

module.exports = merge(baseWebpackConfig, prodWebpackConfig)

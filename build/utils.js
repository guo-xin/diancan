var path = require('path')
var glob = require('glob')
var config = require('../config')
var appConfig = require('../appConfig')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  return path.posix.join(config.assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css?-autoprefixer']),
    postcss: generateLoaders(['css?-autoprefixer']),
    less: generateLoaders(['css?-autoprefixer', 'less']),
    sass: generateLoaders(['css?-autoprefixer', 'sass?indentedSyntax']),
    scss: generateLoaders(['css?-autoprefixer', 'sass?outputStyle=expanded']),
    stylus: generateLoaders(['css?-autoprefixer', 'stylus']),
    styl: generateLoaders(['css?-autoprefixer', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  // console.log('styleLoaders', output)
  return output
}

exports.entry = (function () {
  var entry = {};
  glob.sync('./src/pages/*').forEach(function (name) {
    // var n = name.slice(12, name.length - 3);
    var n = name.slice(12, name.length - 0);
    // n = n.slice(0, n.lastIndexOf('/'));
    //接着我对路径字符串进行了一些裁剪成想要的路径
    // entry[n] = name;
    entry[n] = name + '/index.js';
  });

  // var entry = {};
  // appConfig.pages.forEach(function (item, index) {
  //   console.log(item)
  //   console.log(index)
  //   entry[item.filename] = item.main
  // })

  // console.log('entry:::', entry)

  return entry;
})();

/**
 * 环境
 * development: 开发
 * testing: 测试环境
 * production: 生产环境（默认）
 * online: 线上环境
 */
exports.env = (function () {
  var env = process.argv[2] || 'production';
  return env;
})();

var path = require('path')
require('shelljs/global')

module.exports = {
  env: {
    NODE_ENV: 'production'
  },
  index: path.resolve(__dirname, '../dist/index.html'),
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static/',
  assetsPublicPath: '/dc/',
  productionSourceMap: false
}

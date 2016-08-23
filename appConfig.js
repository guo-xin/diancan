/**
 * Created by aidenZou on 16/5/6.
 */

/**
 * chunks
 * vue vue-resource
 */

// 页面配置
exports.pages = [
  {
    filename: 'index',
    template: 'src/pages/index/index.ejs',
    title: '好近点餐',
    chunks: 'vue_vue-resource'
  },
  {
    filename: 'order-list',
    template: 'src/pages/order-list/index.ejs',
    title: '好近点餐',
    chunks: 'vue_vue-resource'
  }
]

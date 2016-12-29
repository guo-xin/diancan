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
    title: '我的订单',
    chunks: 'vue_vue-resource'
  },
  {
    filename: 'take-out',
    template: 'src/pages/take-out/index.ejs',
    title: '好近外送',
    chunks: 'vue_vue-resource'
  }
]

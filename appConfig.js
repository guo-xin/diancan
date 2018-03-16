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
    title:  '', //标题要根据appid来 修改为 微信点餐 or 微信商场
    chunks: 'vue_vue-resource',
    isBuild: true
  },
  {
    filename: 'order-list',
    template: 'src/pages/order-list/index.ejs',
    title: '我的订单',
    chunks: 'vue_vue-resource',
    isBuild: true
  },
  {
    filename: 'take-out',
    template: 'src/pages/take-out/index.ejs',
    title: '微信外送',
    chunks: 'vue_vue-resource',
    isBuild: true
  },
  {
    filename: 'store-list',
    template: 'src/pages/store-list/index.ejs',
    title: '店铺列表',
    chunks: 'vue_vue-resource',
    isBuild: true
  },
  {
    filename: 'scan-qrcode',
    template: 'src/pages/scan-qrcode/index.ejs',
    title: '扫码点餐',
    chunks: 'vue_vue-resource',
    isBuild: true
  }
]

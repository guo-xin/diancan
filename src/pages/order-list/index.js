import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import { isWX } from 'methods/Util'
import { Toast } from 'qfpay-ui'
import config from 'methods/Config'
import {shop, restaurant} from 'methods/merchantTypeLang'
// 将post请求的提交方式默认为表格提交的方式
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
// 在使用cors跨域时带上cookie
Vue.http.options.credentials = true
// 将请求的数据url化
Vue.http.options.emulateJSON = true
// 接口返回未登录时，重新获取 csid
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    let data = response.body
    if (data.respcd === config.code.SESSIONERR || data.respcd === config.code.LOGINERR) {
      let url = `${config.o2Host}trade/v1/customer/get?redirect_uri=` + encodeURIComponent(window.location.href)
      window.location.replace(url)
    }
  })
})

import App from './App'
import 'filters/index'
import { WechatPlugin, Wechat } from 'methods/Wechat'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(WechatPlugin)

Vue.component(Toast.name, Toast)
Vue.prototype.$toast = Toast

// $t 不同商户类型展示不同文案
let isShopText = sessionStorage.getItem('is_shop_text')
if (isShopText === '1') {
  Vue.prototype.$t = shop
} else {
  Vue.prototype.$t = restaurant
}

// 此处声明你需要用到的JS-SDK权限
let jsApiList = [
  'hideMenuItems'
]

if (process.env.NODE_ENV === 'production' || isWX) {
  Wechat.init(jsApiList)
  Wechat.ready().then(Wechat.hideOptionMenu)
  initVue()
} else {
  initVue()
}

function initVue () {
  let routes = [
    {
      path: '/merchant/:mchnt_id',
      name: 'merchant',
      component: App
    },
    { // 展示该渠道下的所有订单
      path: '/group/:group_id',
      name: 'group',
      component: App
    }
  ]
  const router = new VueRouter({
    routes
  })
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
}

import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import 'filters/index'
import App from './App'
import Merchant from 'views/Merchant'
import CreateOrder from 'views/CreateOrder'
import OrderDetail from 'views/OrderDetail'
import About from 'views/About'

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true

const router = new VueRouter({
  routes: [
    {
      name: 'merchant', // 首页点餐
      path: '/merchant/:mchnt_id',
      component: Merchant,
      children: [{
        path: '/:address',
        component: Merchant,
        children: [{
          path: '/:expire_time',
          component: Merchant
        }]
      }]
    },
    {
      path: '/create_order/:mchnt_id/:address', // 创建订单
      name: 'createOrder',
      component: CreateOrder
    },
    {
      path: '/order_detail/:order_id/:mchnt_id', // 订单详情: 订单id|商户id
      name: 'orderDetail',
      component: OrderDetail
    },
    {
      path: '/about', // 关于
      name: 'about',
      component: About
    }
  ]
})

// 此处声明你需要用到的JS-SDK权限
let jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'hideMenuItems',
  'showMenuItems',
  'getLocation',
  'scanQRCode'
]
import { WechatPlugin, Wechat } from '../../methods/Wechat'
Vue.use(WechatPlugin)

Wechat.verify().then(initVue)
Wechat.init(jsApiList)
Wechat.ready()
.then(Wechat.hideOptionMenu)

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
}

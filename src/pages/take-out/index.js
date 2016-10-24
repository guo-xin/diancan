import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import 'core-js/fn/array/find'
import 'core-js/fn/array/find-index'
import 'core-js/fn/array/map'
import 'core-js/fn/object/assign'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import '../../filters/index'
import App from './App.vue'

Vue.use(VueResource)
Vue.use(VueRouter)
let router = new VueRouter()

Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true
import Wechat from '../../methods/Wechat'
Wechat.verify().then(initRouter)
// initRouter()
Wechat.init()
Wechat.hideOptionMenu()
Wechat.noResize()
function initRouter () {
  router.map({
    '/merchant/:mchnt_id': {
      name: 'merchant',
      component: require('./views/Merchant')
    },
    'create_order/:mchnt_id': { // 创建订单
      name: 'createOrder',
      component: require('./views/CreateOrder')
    },
    '/address/list': {
      name: 'addressList',
      component: require('./components/addr-list.vue')
    },
    '/address/add': {
      name: 'addressAdd',
      component: require('./components/addr-add.vue')
    },
    '/address/update': {
      name: 'addressUpdate',
      component: require('./components/addr-update.vue')
    },
    'order_detail/:order_id/:mchnt_id': { // 订单详情: 订单id|商户id
      name: 'orderDetail',
      component: require('./views/OrderDetail')
    }
  })
  router.start(App, '#app')
}
/* eslint-disable no-new */

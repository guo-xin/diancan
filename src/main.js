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

import './filters/index'
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

import Wechat from './methods/Wechat'
Wechat.init()
Wechat.hideOptionMenu()

router.map({
  '/merchant/:mchnt_id': {
    name: 'merchant',
    component: require('./views/Merchant')
  },
  '/merchant/:mchnt_id/:address': {
    name: 'merchant',
    component: require('./views/Merchant')
  },
  'create_order/:mchnt_id/:address': { // 创建订单
    name: 'createOrder',
    component: require('./views/CreateOrder')
  },
  'order_detail/:order_id/:mchnt_id': { // 订单详情: 订单id|商户id
    name: 'orderDetail',
    component: require('./views/OrderDetail')
  },
  '/about': { // 关于
    name: 'about',
    component: require('./views/About.vue')
  }
})

router.start(App, '#app')

/* eslint-disable no-new */

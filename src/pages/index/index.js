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
import Merchant from '../../views/Merchant.vue'
import CreateOrder from '../../views/CreateOrder.vue'
import OrderDetail from '../../views/OrderDetail.vue'
import About from '../../views/About.vue'

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true
import Wechat from '../../methods/Wechat'
Wechat.verify().then(initVue)
// initVue()
Wechat.init()
Wechat.hideOptionMenu()
Wechat.noResize()

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
      path: 'create_order/:mchnt_id/:address', // 创建订单
      name: 'createOrder',
      component: CreateOrder
    },
    {
      path: 'order_detail/:order_id/:mchnt_id', // 订单详情: 订单id|商户id
      name: 'orderDetail',
      component: OrderDetail
    },
    {
      path: 'about', // 关于
      name: 'about',
      component: About
    }
  ]
})

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    render: h => h('App'),
    components: { App }
  })
}

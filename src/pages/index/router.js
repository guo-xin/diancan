import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

import Merchant from 'views/Merchant'
import CreateOrder from 'views/CreateOrder'
import OrderDetail from 'views/OrderDetail'
import About from 'views/About'

const routes = [
  {
    name: 'merchant', // 首页点餐
    path: '/merchant/:mchnt_id',
    component: Merchant
  },
  {
    name: 'merchantAddress', // 首页点餐带桌号
    path: '/merchant/:mchnt_id/:address',
    component: Merchant
  },
  {
    name: 'merchantAddressExpire', // 首页点餐带桌号带过期时间
    path: '/merchant/:mchnt_id/:address/:expire_time',
    component: Merchant
  },
  {
    path: '/!/merchant/:mchnt_id', // 兼容老链接 #!会自动去掉! 变成#
    redirect: { name: 'merchant' }
  },
  {
    path: '/!/merchant/:mchnt_id/:address', // 兼容老链接 #!会自动去掉! 变成#
    redirect: { name: 'merchantAddress' }
  },
  {
    path: '/!/merchant/:mchnt_id/:address/:expire_time', // 兼容老链接 #!会自动去掉! 变成#
    redirect: { name: 'merchantAddressExpire' }
  },
  {
    path: '/create_order/:mchnt_id/:address', // 创建订单
    name: 'createOrder',
    component: CreateOrder
  },
  {
    path: '/order_detail/:order_id/:mchnt_id/', // 订单详情: 订单id|商户id
    name: 'orderDetail',
    component: OrderDetail
  },
  {
    path: '/about', // 关于
    name: 'about',
    component: About
  }
]

export default new VueRouter({
  routes
})

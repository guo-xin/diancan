import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [
  {
    path: '/merchant/:mchnt_id',
    name: 'merchant',
    component: require('./views/Merchant')
  },
  { // 创建订单
    path: 'create_order/:mchnt_id',
    name: 'createOrder',
    component: require('./views/CreateOrder')
  },
  {
    path: '/address/list',
    name: 'addressList',
    component: require('./components/addr-list.vue')
  },
  {
    path: '/address/add',
    name: 'addressAdd',
    component: require('./components/addr-add.vue')
  },
  {
    path: '/address/marker',
    name: 'addressMarker',
    component: require('./components/MapMarker.vue')
  },
  {
    path: '/address/update',
    name: 'addressUpdate',
    component: require('./components/addr-update.vue')
  },
  { // 订单详情: 订单id|商户id
    path: 'order_detail/:order_id/:mchnt_id',
    name: 'orderDetail',
    component: require('./views/OrderDetail')
  }
]

export default new VueRouter({
  routes
})

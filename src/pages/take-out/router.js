import Vue from 'vue'
import VueRouter from 'vue-router'
import Merchant from './views/Merchant'
import CreateOrder from './views/CreateOrder'
import AddrList from './components/addr-list'
import AddrAdd from './components/addr-add'
import MapMarker from './components/MapMarker'
import AddressUpdate from './components/addr-update'
import OrderDetail from './views/OrderDetail'

Vue.use(VueRouter)

let routes = [
  {
    path: '/merchant/:mchnt_id',
    name: 'merchant',
    component: Merchant
  },
  {
    path: '/!/merchant/:mchnt_id', // 兼容老链接 #!会自动去掉! 变成#
    redirect: { name: 'merchant' }
  },
  { // 创建订单
    path: '/create_order/:mchnt_id',
    name: 'createOrder',
    component: CreateOrder
  },
  {
    path: '/address/list',
    name: 'addressList',
    component: AddrList
  },
  {
    path: '/address/add',
    name: 'addressAdd',
    component: AddrAdd
  },
  {
    path: '/address/marker',
    name: 'addressMarker',
    component: MapMarker
  },
  {
    path: '/address/update',
    name: 'addressUpdate',
    component: AddressUpdate
  },
  { // 订单详情: 订单id|商户id
    path: '/order_detail/:order_id/:mchnt_id',
    name: 'orderDetail',
    component: OrderDetail
  }
  // {
  //   path: '/!/order_detail/:order_id/:mchnt_id', // 兼容老链接 #!会自动去掉! 变成#
  //   redirect: { name: 'orderDetail' }
  // }
]

export default new VueRouter({
  routes
})

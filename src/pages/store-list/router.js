import Vue from 'vue'
import VueRouter from 'vue-router'
import TangShi from './views/TangShi'
import StoreList from './views/StoreList'

Vue.use(VueRouter)

let routes = [
  {
    path: '/merchant/:mchnt_id',
    name: 'merchant',
    component: StoreList
  },
  {
    path: '/!/merchant/:mchnt_id', // 兼容老链接 #!会自动去掉! 变成#
    redirect: { name: 'merchant' }
  },
  { // 展示该渠道下的所有店铺
    path: '/group/:group_id',
    name: 'group',
    component: StoreList
  },
  {
    path: '/merchant/:mchnt_id/group/:group_id',
    name: 'group',
    component: StoreList
  },
  {
    path: '/merchant/:mchnt_id/tangshi/',
    name: 'tangshi',
    component: TangShi
  }
]

export default new VueRouter({
  routes
})

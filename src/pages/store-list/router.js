import Vue from 'vue'
import VueRouter from 'vue-router'
import TangShi from './views/TangShi'
import GroupList from './views/GroupList'

Vue.use(VueRouter)

let routes = [
  {
    path: '/',
    name: 'index',
    component: GroupList
  },
  {
    path: '/merchant/:mchnt_id',
    name: 'merchant',
    component: GroupList
  },
  {
    path: '/!/merchant/:mchnt_id', // 兼容老链接 #!会自动去掉! 变成#
    redirect: { name: 'merchant' }
  },
  {
    path: '/group/:group_id',
    name: 'group',
    component: GroupList
  },
  {
    path: '/tangshi/:mchnt_id',
    name: 'tangshi',
    component: TangShi
  }
]

export default new VueRouter({
  routes
})

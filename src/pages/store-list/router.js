import Vue from 'vue'
import VueRouter from 'vue-router'
// import StoreList from './views/StoreList'
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

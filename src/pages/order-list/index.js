import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import 'core-js/fn/array/find'
import 'core-js/fn/array/find-index'
import 'core-js/fn/array/map'
import 'core-js/fn/object/assign'

import Vue from 'vue'
import VueResource from 'vue-resource'

import '../../filters/index'
import App from './App.vue'

Vue.use(VueResource)

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

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: 'body',
    components: { App }
  })
}
/* eslint-disable no-new */

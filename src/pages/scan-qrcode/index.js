import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'

import App from './App.vue'

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

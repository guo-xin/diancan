import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'

import App from './App.vue'

import Wechat from '../../methods/Wechat'
// initVue()
Wechat.verify().then(initVue)
Wechat.init([
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'scanQRCode'
])
Wechat.hideOptionMenu()

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    render: creatElment => creatElment('App'),
    components: { App }
  })
}

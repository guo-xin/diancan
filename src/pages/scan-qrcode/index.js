
import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'

import App from './App'
import 'filters/index'
import { WechatPlugin, Wechat } from 'methods/Wechat'

Vue.use(WechatPlugin)

// 此处声明你需要用到的JS-SDK权限
let jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'scanQRCode'
]
// 需要csid的情况
// Wechat.verify().then(initVue)
// 不需要csid的情况
initVue()

Wechat.init(jsApiList)
Wechat.ready()
.then(Wechat.hideAllNonBaseMenuItem)

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
  })
}

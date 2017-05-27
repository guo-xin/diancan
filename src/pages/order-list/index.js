import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'
import VueResource from 'vue-resource'
import { verify } from 'methods/verify'

// 将post请求的提交方式默认为表格提交的方式
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
// 在使用cors跨域时带上cookie
Vue.http.options.xhr = {
  withCredentials: true
}
// 将请求的数据url化
Vue.http.options.emulateJSON = true

import App from './App'
import 'filters/index'
import { WechatPlugin, Wechat } from 'methods/Wechat'

Vue.use(VueResource)
Vue.use(WechatPlugin)

// 此处声明你需要用到的JS-SDK权限
let jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'hideMenuItems',
  'showMenuItems',
  'getLocation',
  'scanQRCode'
]
// 需要csid的情况
verify().then(initVue)
// 不需要csid的情况
// initVue()

Wechat.init(jsApiList)
Wechat.ready()
.then(Wechat.hideOptionMenu)

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
  })
}

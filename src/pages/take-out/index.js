import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import { verify } from 'methods/verify'
import { Toast } from 'qfpay-ui'

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
import Util from 'methods/Util'

Vue.use(VueResource)
Vue.use(WechatPlugin)

Vue.component(Toast.name, Toast)
Vue.prototype.$toast = Toast

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

if (Util.isWX) {
  verify().then(initVue)
  Wechat.init(jsApiList)
  Wechat.ready()
  .then(() => {
    Wechat.hideOptionMenu()
    Wechat.getFormattedAddress()
  })
} else {
  initVue()
}

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    data: {
      eventHub: new Vue()
    }
  })
}

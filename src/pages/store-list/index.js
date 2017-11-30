import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
// import { verify } from 'methods/verify'
import { Toast } from 'qfpay-ui'
import config from 'methods/Config'

// 将post请求的提交方式默认为表格提交的方式
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
// 在使用cors跨域时带上cookie
Vue.http.options.credentials = true
// 将请求的数据url化
Vue.http.options.emulateJSON = true
// 接口返回未登录时，重新获取 csid
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    let data = response.body
    if (data.respcd === config.code.SESSIONERR || data.respcd === config.code.LOGINERR) {
      let appid = sessionStorage.getItem('dc_appid') || 'wxeb6e671f5571abce'
      let url = `${config.o2_host}trade/v1/customer/get?appid=${appid}&redirect_uri=` + encodeURIComponent(window.location.href)
      window.location.replace(url)
    }
  })
})

import App from './App'
import 'filters/index'
import { WechatPlugin, Wechat } from 'methods/Wechat'

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

// 需要csid的情况
// verify().then(initVue)
// 不需要csid的情况
initVue()

Wechat.init(jsApiList)
Wechat.ready()
.then(() => {
  Wechat.hideOptionMenu()
  Wechat.getFormattedAddress()
})

function initVue () {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
}

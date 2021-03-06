import 'lib-flexible'
import FastClick from 'fastclick'
window.FastClick = FastClick

import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import { verify } from 'methods/verify'
import { Toast, MessageBox } from 'qfpay-ui'
import config from 'methods/Config'
import {shop, restaurant} from 'methods/merchantTypeLang'
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
      let url = `${config.o2Host}trade/v1/customer/get?appid=${appid}&redirect_uri=` + encodeURIComponent(window.location.href)
      window.location.replace(url)
    }
  })
})

import App from './App'
import 'filters/index'
import { WechatPlugin, Wechat } from 'methods/Wechat'
import Util from 'methods/Util'
Vue.use(VueResource)
Vue.use(WechatPlugin)

Vue.component(Toast.name, Toast)
Vue.prototype.$toast = Toast
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$messagebox = MessageBox
// $t 不同商户类型展示不同文案
let isShopText = sessionStorage.getItem('is_shop_text')
if (isShopText === '1') {
  Vue.prototype.$t = shop
} else {
  Vue.prototype.$t = restaurant
}
// 此处声明你需要用到的JS-SDK权限
let jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'hideOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'onMenuShareAppMessage',
  'onMenuShareTimeline',
  'scanQRCode'
]

if (Util.isWX || process.env.NODE_ENV === 'production') {
  verify().then(initVue)
  Wechat.init(jsApiList)
  Wechat.ready()
  .then(() => {
    Wechat.hideOptionMenu() // 首页分享按钮进入就要显示
    const menuList = {
      menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
    }
    Wechat.showMenuItems(menuList)
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
      // eventHub: new Vue()
    }
  })
}

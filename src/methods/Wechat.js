/**
 * 微信相关
 * Created by aidenZou on 16/6/17.
 */

import Util from './Util'
import Config from './Config'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true

exports.verify = function () {
  let url = ''
  let params = Util.getRequestParams(window.location.search)
  console.log(params)
  let code = params.code || ''
  let openid = params.openid || window.localStorage.getItem('openid') || ''

  if (openid) {
    window.localStorage.setItem('openid', openid)
    let redirectUri = window.localStorage.getItem('redirect_uri')
    if (redirectUri) {
      window.localStorage.setItem('redirect_uri', '')
      window.location.replace(decodeURIComponent(redirectUri))
    }
    return
  }
  if (code) {
    url = Config.apiHost + 'diancan/weixincallback?redirect_url=' + encodeURIComponent(window.location.origin + window.location.pathname + '?') + '&code=' + code
    window.location.replace(url)
  } else {
    window.localStorage.setItem('redirect_uri', encodeURIComponent(window.location.href))
    // window.location.href = 'https://o2.qfpay.com/trade/wechat/v1/get_weixin_code?appid=wx087a3fc3f3757766&redirect_uri=' + window.localStorage.redirect_uri + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
    // url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Config.appid + '&redirect_uri=' + encodeURIComponent(window.location.origin + window.location.pathname) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'

    url = Config.o2Host + 'trade/wechat/v1/get_weixin_code?appid=' + Config.appid + '&redirect_uri=' + encodeURIComponent(window.location.origin + window.location.pathname) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
    window.location.replace(url)
  }
}

/* global wx */

const jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'hideMenuItems',
  'showMenuItems',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo'
]

exports.init = () => {

  let args = {
    format: 'jsonp',
    url: window.location.href
  }
  Vue.http.jsonp(Config.apiHost + 'v1/manage/wxjs_conf', args)
    .then((response) => {
      console.log(response)
      let data = response.data
      if (data.respcd !== Config.code.OK) {
        console.log('获取微信分享数据出现错误：', data.respmsg)
        // this.$dispatch('on-toast', data.respmsg)
        return
      }
      data = data.data
      let wxargs = {
        debug: true,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId,  // 必填，公众号的唯一标识
        timestamp: data.timestamp,  // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,  // 必填，签名，见附录1
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      }
      wxargs.jsApiList = jsApiList
      data.url = window.location.href
      wx.config(wxargs)
    }, (response) => {
      console.log('获取微信分享数据出现错误：', response)
    })

  wx.error((res) => {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    console.error(res)
  })
}

let isReady = false
// let actionQueue = []
wx.ready(() => {
  isReady = true
  console.log(isReady)
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  // wx.hideOptionMenu()
  // runActionQueue()
})

// const runActionQueue = () => {
//   for (let index in actionQueue) {
//     let actionObj = actionQueue[index]
//     console.log(actionObj)
//     // wx.onMenuShareAppMessage(params)
//   }
// }

// const push = (action, args = null) => {
//   action && actionQueue.push({action, args})
// }

// 隐藏右上角菜单接口
exports.hideOptionMenu = () => {
  console.log(isReady)
  console.log('隐藏菜单...')
  wx.hideOptionMenu()
  // push()
}

// 分享给朋友
exports.onMenuShareAppMessage = (args) => {
  console.log(isReady)
  let params = Object.assign({
    title: '好近点餐', // 分享标题
    desc: '好近点餐好近点餐好近点餐', // 分享描述
    link: '', // 分享链接
    imgUrl: 'http://near.m1img.com/op_upload/8/146667767887.png', // 分享图标
    // type: '', // 分享类型,music、video或link，不填默认为link
    // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success () {
    },
    cancel () {
    }
  }, args)
  console.log('分享给朋友...', params)
  wx.onMenuShareAppMessage(params)
}

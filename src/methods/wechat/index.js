/* global wx */
import Config from '../Config'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

/* global wx */
const DEBUG = false
const jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'hideMenuItems',
  'hideOptionMenu',
  'showMenuItems',
  'getLocation',
  'scanQRCode',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo'
]

const getWxConfig = (args, jsApis = jsApiList) => {
  args = { ...args, format: 'jsonp' }
  return new Promise((resolve, reject) => {
    Vue.http({
      url: `${Config.wxmpHost}v1/manage/wxjs_conf`,
      method: 'JSONP',
      params: args
    })
    .then((res) => {
      let data = res.data
      if (data.respcd !== Config.code.OK) {
        console.error('获取微信分享数据出现错误：', data.respmsg)
        return
      }
      let wxData = data.data
      let wxargs = {
        debug: DEBUG,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: wxData.appId,  // 必填，公众号的唯一标识
        timestamp: wxData.timestamp,  // 必填，生成签名的时间戳
        nonceStr: wxData.nonceStr, // 必填，生成签名的随机串
        signature: wxData.signature,  // 必填，签名，见附录1
        jsApiList: jsApis // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      }
      wx.config(wxargs)
    })
    .catch((err) => {
      console.log('获取微信分享数据出现错误：', err)
    })
  })
}
const init = async (jsApis = jsApiList) => {
  // 如果 appid 拿不到，再加上 diancan/c/takeauthinfo 请求拿的逻辑
  let args = {
    // app_id: sessionStorage.getItem('dc_appid'),
    format: 'jsonp',
    url: window.location.href
  }
  await new Promise(function (resolve, reject) {
    getWxConfig(args, jsApis)
    resolve()
  })
}

const ready = () => {
  return new Promise((resolve, reject) => {
    try {
      wx && wx.ready(() => {
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

// 隐藏右上角菜单接口
const hideOptionMenu = () => {
  wx.hideOptionMenu()
}

// 显示右上角菜单接口
const showMenuItems = (menuList) => {
  wx.showMenuItems(menuList)
}

// 获取经纬度接口
const getCoords = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        window.localStorage.setItem('longitude', res.longitude)
        window.localStorage.setItem('latitude', res.latitude)
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

// 分享给朋友
const menuShareAppMessage = (args) => {
  wx.onMenuShareAppMessage(args)
}
// 分享到朋友圈
const menuShareTimeline = (args) => {
  wx.onMenuShareTimeline(args)
}
// 唤起二维码
const scanQRcode = () => {
  wx.scanQRCode({
    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: ['qrCode', 'barCode'] // 可以指定扫二维码还是一维码，默认二者都有
  })
}

const hideAllNonBaseMenuItem = () => {
  wx.hideAllNonBaseMenuItem()
}

export default {
  init,
  ready,
  hideOptionMenu,
  showMenuItems,
  getCoords,
  menuShareAppMessage,
  menuShareTimeline,
  scanQRcode,
  hideAllNonBaseMenuItem
}

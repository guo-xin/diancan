/* global wx */
import Config from '../Config'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const getAuthInfo = (mchtId) => {
  return new Promise((resolve, reject) => {
    Vue.http({
      method: 'jsonp',
      url: `${Config.apiHost}diancan/c/takeauthinfo?mchnt_id=${mchtId}&format=jsonp`
    })
    .then((res) => {
      let data = res.data
      if (data.respcd === Config.code.OK) {
        console.log(data.data)
        resolve(data.data)
      } else {
        window.alert(data.resperr)
      }
    })
    .catch(() => {
      window.alert('网络错误!')
    })
  })
}

const getWeixinBack = (data) => {
  return new Promise((resolve, reject) => {
    Vue.http({
      method: 'jsonp',
      url: `${Config.apiHost}diancan/weixincallback?format=jsonp&appid=${data.appid}`
    })
    .then((res) => {
      let data = res.data
      if (data.respcd === Config.code.OK) {
        window.localStorage.setItem('dc_appid', res.data.data.appid)
        window.localStorage.setItem('dc_openid', res.data.data.openid)
        resolve()
      } else {
        let url = `${Config.o2Host}trade/v1/customer/get?appid=${data.data.appid}&redirect_uri=` + encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
        window.location.replace(url)
      }
    })
  })
}

const getVerify = async (mchtId) => {
  let data = await getAuthInfo(mchtId)
  await getWeixinBack(data)
}

const verify = async () => {
  let hashArray, tempHashMchtId
  let LSArray, tempLSMchtId

  if (window.location.hash) {
    window.localStorage.setItem('redirect_uri', window.location.hash)
    hashArray = window.location.hash.split('/')
    tempHashMchtId = hashArray[1] === 'merchant' ? hashArray[2] : hashArray[3]
  }
  if (window.localStorage.getItem('redirect_uri')) {
    LSArray = window.localStorage.getItem('redirect_uri').split('/')
    tempLSMchtId = LSArray[1] === 'merchant' ? LSArray[2] : LSArray[3]
  }
  let mchtId = tempHashMchtId || tempLSMchtId

  await getVerify(mchtId)
}

/* global wx */
const DEBUG = false
const jsApiList = [
  'checkJsApi',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'hideMenuItems',
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
      wxData.url = window.location.href
      wx.config(wxargs)
    })
    .catch((err) => {
      console.log('获取微信分享数据出现错误：', err)
    })
  })
}
const init = async (jsApis = jsApiList) => {
  let args = {
    format: 'jsonp',
    url: window.location.href
  }
  await getWxConfig(args, jsApis)
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

// 获取经纬度接口
const getCoords = () => {
  return new Promise(function (resolve, reject) {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        window.localStorage.setItem('longitude', res.longitude)
        window.localStorage.setItem('latitude', res.latitude)
        resolve()
      }
    })
  })
}

// 分享给朋友
const menuShareAppMessage = (args) => {
  let defaultParams = {
    title: '好近点餐', // 分享标题
    desc: '好近点餐好近点餐好近点餐', // 分享描述
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    // type: '', // 分享类型,music、video或link，不填默认为link
    // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success () {
    },
    cancel () {
    }
  }
  let params = {...defaultParams, ...args}
  const menuList = {
    menuList: ['menuItem:share:appMessage']
  }
  wx.showMenuItems(menuList)
  wx.onMenuShareAppMessage(params)
}
// 分享到朋友圈
const menuShareTimeline = (args) => {
  let defaultParams = {
    title: '好近点餐', // 分享标题
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    // type: '', // 分享类型,music、video或link，不填默认为link
    // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success () {
    },
    cancel () {
    }
  }
  let params = {...defaultParams, ...args}
  const menuList = {
    menuList: ['menuItem:share:timeline']
  }
  wx.showMenuItems(menuList)
  wx.onMenuShareTimeline(params)
}
// 唤起二维码
const scanQRcode = () => {
  wx.scanQRCode({
    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: ['qrCode', 'barCode'] // 可以指定扫二维码还是一维码，默认二者都有
  })
}

export default {
  verify,
  init,
  ready,
  hideOptionMenu,
  getCoords,
  menuShareAppMessage,
  menuShareTimeline,
  scanQRcode
}

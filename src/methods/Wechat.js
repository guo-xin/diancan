/**
 * 微信相关
 * Created by aidenZou on 16/6/17.
 */

// import Util from './Util'
import Config from './Config'
import Vue from 'vue'
import VueResource from 'vue-resource'
import store from '../vuex/store'

Vue.use(VueResource)
Vue.http.options.headers = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
}
Vue.http.options.xhr = {
  withCredentials: true
}
Vue.http.options.emulateJSON = true

const Wechat = {}

// const OPENID = Config.OPENID

Wechat.verify = function () {
  return new Promise(function (resolve, reject) {
    let url = ''
    let hashArray, tempHashMchtId
    if (window.location.hash) {
      window.localStorage.setItem('redirect_uri', window.location.hash)
      hashArray = window.location.hash.split('/')
      tempHashMchtId = hashArray[1] === 'merchant' ? hashArray[2] : hashArray[3]
    }
    let LSArray, tempLSMchtId
    if (window.localStorage.getItem('redirect_uri')) {
      LSArray = window.localStorage.getItem('redirect_uri').split('/')
      tempLSMchtId = LSArray[1] === 'merchant' ? LSArray[2] : LSArray[3]
    }
    let mchtId = tempHashMchtId || tempLSMchtId

    // 获取商户 appid,component_appid,component_access_token
    Vue.http.jsonp(`${Config.apiHost}diancan/c/takeauthinfo?mchnt_id=${mchtId}&format=jsonp`)
      .then((response) => {
        if (response.data.respcd === '0000') {
          let data = response.data.data
          Vue.http.jsonp(`${Config.apiHost}diancan/weixincallback?format=jsonp&appid=${data.appid}`)
            .then((res) => {
              if (res.data.respcd === '0000') {
                window.localStorage.setItem('dc_appid', res.data.data.appid)
                window.localStorage.setItem('dc_openid', res.data.data.openid)
                resolve()
              } else {
                url = `${Config.o2Host}trade/v1/customer/get?appid=${data.appid}&redirect_uri=` + encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
                window.location.replace(url)
              }
            })
        } else {
          window.alert(response.data.resperr)
        }
      }, (res) => {
        window.alert('请求失败')
      }
    )
  })
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

Wechat.init = (jsApis = jsApiList) => {
  let args = {
    format: 'jsonp',
    url: window.location.href
  }
  Vue.http.jsonp(Config.wxmpHost + 'v1/manage/wxjs_conf', args)
    .then((response) => {
      let data = response.data
      if (data.respcd !== Config.code.OK) {
        console.error('获取微信分享数据出现错误：', data.respmsg)
        // this.$dispatch('on-toast', data.respmsg)
        return
      }
      data = data.data
      let wxargs = {
        debug: DEBUG,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId,  // 必填，公众号的唯一标识
        timestamp: data.timestamp,  // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,  // 必填，签名，见附录1
        jsApiList: jsApis // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      }
      data.url = window.location.href
      wx.config(wxargs)
    }, (response) => {
      console.log('获取微信分享数据出现错误：', response)
    })
}

let isReady = false
let actionQueue = []
wx && wx.ready(() => {
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      window.localStorage.setItem('longitude', res.longitude)
      window.localStorage.setItem('latitude', res.latitude)
      let args = {
        key: 'R56BZ-S42KF-YGAJ6-N5APF-ASCI6-2VBL3',  // 腾讯地图 逆地址解析 http://lbs.qq.com/webservice_v1/guide-gcoder.html
        location: `${res.latitude},${res.longitude}`, // '116.480881,39.989410'
        output: 'jsonp'
      }
      Vue.http({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        method: 'JSONP',
        data: args
      }).then(function (response) {
        if (response.status === 200) {
          let formattedAddress = response.data.result.formatted_addresses.recommend
          store.dispatch('UPDATEADDRESS', formattedAddress)
          window.localStorage.setItem('formatted_address', formattedAddress)
        }
      })
    }
  })
  isReady = true
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
  // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  // wx.hideOptionMenu()
  runActionQueue()
})
wx && wx.error((res) => {
  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
  console.error(res)
})

const runActionQueue = () => {
  for (let index in actionQueue) {
    let actionObj = actionQueue[index]
    /* eslint no-eval: "error" */
    /* eslint-disable no-eval */
    window.eval(actionObj)
  }
  actionQueue = []
}

// 隐藏右上角菜单接口
Wechat.hideOptionMenu = () => {
  if (!isReady) {
    // actionQueue.push('wx.hideOptionMenu()')
    actionQueue.push('wx.hideAllNonBaseMenuItem()')
    return
  }
  wx.hideOptionMenu()
  // push()
}

// 获取经纬度接口
Wechat.getCoords = () => {
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

// 通过经纬度 获取详细地址
Wechat.getFormattedAddress = () => {
  return new Promise(function (resolve, reject) {
    let longitude = window.localStorage.getItem('longitude')
    let latitude = window.localStorage.getItem('latitude')
    let args = {
      key: 'R56BZ-S42KF-YGAJ6-N5APF-ASCI6-2VBL3',  // 腾讯地图 逆地址解析 http://lbs.qq.com/webservice_v1/guide-gcoder.html
      location: `${latitude},${longitude}`, // '116.480881,39.989410'
      output: 'jsonp'
    }
    Vue.http({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      method: 'JSONP',
      data: args
    }).then(function (response) {
      if (response.status === 200) {
        let formattedAddress = response.data.result.formatted_addresses.recommend
        window.localStorage.setItem('formatted_address', formattedAddress)
        resolve()
      }
    })
  })
}

// 分享给朋友
Wechat.onMenuShareAppMessage = (args) => {
  let params = Object.assign({
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
  }, args)
  const menuList = {
    menuList: ['menuItem:share:appMessage']
  }
  if (!isReady) {
    actionQueue.push('wx.showMenuItems(' + JSON.stringify(menuList) + ')')
    actionQueue.push('wx.onMenuShareAppMessage(' + JSON.stringify(params) + ')')
    return
  }
  wx.showMenuItems(menuList)
  wx.onMenuShareAppMessage(params)
}
// 分享到朋友圈
Wechat.onMenuShareTimeline = (args) => {
  let params = Object.assign({
    title: '好近点餐', // 分享标题
    link: '', // 分享链接
    imgUrl: '', // 分享图标
    // type: '', // 分享类型,music、video或link，不填默认为link
    // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success () {
    },
    cancel () {
    }
  }, args)
  const menuList = {
    menuList: ['menuItem:share:timeline']
  }
  if (!isReady) {
    actionQueue.push('wx.showMenuItems(' + JSON.stringify(menuList) + ')')
    actionQueue.push('wx.onMenuShareTimeline(' + JSON.stringify(params) + ')')
    return
  }
  wx.showMenuItems(menuList)
  wx.onMenuShareTimeline(params)
}
// 唤起二维码
Wechat.onScanQRcode = () => {
  if (!isReady) {
    const params = {
      needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'] // 可以指定扫二维码还是一维码，默认二者都有
    }
    actionQueue.push('wx.scanQRCode(' + JSON.stringify(params) + ')')
    return
  }
  wx.scanQRCode({
    needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    scanType: ['qrCode', 'barCode'] // 可以指定扫二维码还是一维码，默认二者都有
  })
}

/* global WeixinJSBridge */
Wechat.noResize = () => {
  function handleFontSize () {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 })
    // 重写设置网页字体大小的事件
    WeixinJSBridge.on('menu:setfont', function () {
      WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 })
    })
  }
  let u = window.navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1
  if (isAndroid) {
    if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
      handleFontSize()
    } else {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', handleFontSize)
        document.attachEvent('onWeixinJSBridgeReady', handleFontSize)
      }
    }
  }
}

export default Wechat

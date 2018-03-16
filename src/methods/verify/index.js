
import Config from '../Config'
import Vue from 'vue'
import VueResource from 'vue-resource'
import Util from 'methods/Util'
import {shop, restaurant} from 'methods/merchantTypeLang'
Vue.use(VueResource)

const getTakeAuthInfo = (mchtId) => {
  return new Promise((resolve, reject) => {
    Vue.http({
      method: 'jsonp',
      url: `${Config.apiHost}diancan/c/takeauthinfo`,
      params: {
        mchnt_id: mchtId,
        format: 'jsonp'
      }
    })
    .then((res) => {
      let data = res.data
      if (data.respcd === Config.code.OK) {
        let appid = data.data.appid
        sessionStorage.setItem('dc_appid', appid)
        // $t 不同商户类型展示不同文案
        if (appid === 'wx4a0bbf08f242c6d8') {
          Vue.prototype.$t = shop
        } else {
          Vue.prototype.$t = restaurant
        }
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

const getWeixinCallBack = (data) => {
  return new Promise((resolve, reject) => {
    let appid = data.appid || sessionStorage.getItem('dc_appid')
    Vue.http({
      method: 'jsonp',
      url: `${Config.apiHost}diancan/weixincallback`,
      params: {
        appid: appid,
        format: 'jsonp'
      }
    })
    .then((res) => {
      if (res.data.respcd === Config.code.OK) {
        sessionStorage.setItem('dc_openid', res.data.data.openid)
        resolve()
      } else {
        // reject(data)
        let url = `${Config.o2Host}trade/v1/customer/get?appid=${data.appid}&redirect_uri=` + encodeURIComponent(window.location.href)
        window.location.replace(url)
      }
    })
    .catch((err) => {
      console.log('获取微信回调错误', err)
    })
  })
}

const getVerify = async (mchtId) => {
  let data = await getTakeAuthInfo(mchtId)
  await getWeixinCallBack(data)
}

const getMchntId = () => {
  let hashArray, tempHashMchtId
  let LSArray, tempLSMchtId
  let tempSessionStorageMchtId

  if (window.location.hash) {
    sessionStorage.setItem('redirect_uri', window.location.hash)
    hashArray = window.location.hash.split('/')
    if (hashArray[1] === 'create_order') {
      tempHashMchtId = hashArray[2]
    } else {
      tempHashMchtId = hashArray[1] === 'merchant' ? hashArray[2] : hashArray[3]
    }
  }

  if (sessionStorage.getItem('redirect_uri')) {
    LSArray = sessionStorage.getItem('redirect_uri').split('/')
    tempLSMchtId = LSArray[1] === 'merchant' ? LSArray[2] : LSArray[3]
  }

  tempSessionStorageMchtId = sessionStorage.getItem('mchntId')

  let mchntId = tempHashMchtId || tempLSMchtId || tempSessionStorageMchtId
  if (mchntId && !isNaN(mchntId)) {
    sessionStorage.setItem('mchntId', mchntId)
  }
  return mchntId
}

const isLogin = () => {
  let hasCsid = Util.getCookie('csid')
  let hasOpenid = sessionStorage.getItem('dc_openid')
  let hasMchntid = sessionStorage.getItem('mchntId') === getMchntId()
  return hasCsid && hasOpenid && hasMchntid
}

const verify = async () => {
  if (isLogin()) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }
  let mchtId = getMchntId()
  await getVerify(mchtId)
}

export {
  verify
}

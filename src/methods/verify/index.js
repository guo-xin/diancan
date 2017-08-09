
import Config from '../Config'
import Vue from 'vue'
import VueResource from 'vue-resource'
import Util from 'methods/Util'

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
        sessionStorage.setItem('dc_appid', data.data.appid)
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
    Vue.http({
      method: 'jsonp',
      url: `${Config.apiHost}diancan/weixincallback`,
      params: {
        appid: data.appid,
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
  let QueryArray, tempQueryMchtId

  if (window.location.hash) {
    sessionStorage.setItem('redirect_uri', window.location.hash)
    hashArray = window.location.hash.split('/')
    tempHashMchtId = hashArray[1] === 'merchant' ? hashArray[2] : hashArray[3]
  }

  if (sessionStorage.getItem('redirect_uri')) {
    LSArray = sessionStorage.getItem('redirect_uri').split('/')
    tempLSMchtId = LSArray[1] === 'merchant' ? LSArray[2] : LSArray[3]
  }

  if (window.location.search) {
    QueryArray = window.location.search.split('=')
    tempQueryMchtId = QueryArray[0] === '?mchnt_id' ? QueryArray[1] : QueryArray[2]
  }

  let mchntId = tempHashMchtId || tempLSMchtId || tempQueryMchtId
  if (mchntId && !isNaN(mchntId)) {
    sessionStorage.setItem('mchntId', mchntId)
  }
  return mchntId
}

const isLogin = () => {
  let hasCsid = Util.getCookie('csid')
  let hasOpenid = sessionStorage.getItem('dc_openid')
  return hasCsid && hasOpenid
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


import Config from '../Config'
import Vue from 'vue'
import VueResource from 'vue-resource'

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
        window.localStorage.setItem('dc_appid', res.data.data.appid)
        window.localStorage.setItem('dc_openid', res.data.data.openid)
        resolve()
      } else {
        // reject(data)
        let url = `${Config.o2Host}trade/v1/customer/get?appid=${data.appid}&redirect_uri=` + encodeURIComponent(window.location.origin + window.location.pathname + window.location.search)
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

  if (window.location.hash) {
    window.localStorage.setItem('redirect_uri', window.location.hash)
    hashArray = window.location.hash.split('/')
    tempHashMchtId = hashArray[1] === 'merchant' ? hashArray[2] : hashArray[3]
  }

  if (window.localStorage.getItem('redirect_uri')) {
    LSArray = window.localStorage.getItem('redirect_uri').split('/')
    tempLSMchtId = LSArray[1] === 'merchant' ? LSArray[2] : LSArray[3]
  }

  let mchntId = tempHashMchtId || tempLSMchtId
  if (mchntId && !isNaN(mchntId)) {
    localStorage.setItem('mchntId', mchntId)
  }

  return mchntId
}

const hasStoreMchntId = () => {
  return localStorage.getItem('mchntId')
}

const verify = async () => {
  if (hasStoreMchntId()) {
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

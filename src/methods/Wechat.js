import Wechat from './wechat/index.js'
import Vue from 'vue'
import store from '../vuex/store'

const WechatPlugin = (Vue) => {
  Vue.prototype.$wechat = Wechat
}

// 获取详细地址
let getFormattedAddress = (data) => {
  return new Promise((resolve, reject) => {
    store.commit('UPDATEADDRESS', '未获取到地理位置')
    let args = {
      key: 'R56BZ-S42KF-YGAJ6-N5APF-ASCI6-2VBL3',  // 腾讯地图 逆地址解析 http://lbs.qq.com/webservice_v1/guide-gcoder.html
      location: `${data.latitude},${data.longitude}`, // '116.480881,39.989410'
      output: 'jsonp'
    }
    Vue.http({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      method: 'JSONP',
      params: args
    })
    .then((response) => {
      if (response.status === 200) {
        let formattedAddress = response.data.result.formatted_addresses.recommend
        store.commit('UPDATEADDRESS', formattedAddress)
        window.localStorage.setItem('formatted_address', formattedAddress)
        resolve()
      }
    })
    .catch(() => {
      window.alert('网络错误')
      reject()
    })
  })
}

Wechat.getFormattedAddress = async () => {
  let data = await Wechat.getCoords()
  await getFormattedAddress(data)
}

export { WechatPlugin, Wechat }

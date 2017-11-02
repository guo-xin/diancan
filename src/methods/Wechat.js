import Wechat from './wechat/index.js'
import Vue from 'vue'
import store from '../vuex/store'
import config from 'methods/Config'

const WechatPlugin = (Vue) => {
  Vue.prototype.$wechat = Wechat
}

// 获取详细地址
let getFormattedAddress = (overdist, coords) => {
  if (overdist) {
    return
  }
  return new Promise((resolve, reject) => {
    store.commit('UPDATEADDRESS', '未获取到地理位置')
    let args = {
      key: 'R56BZ-S42KF-YGAJ6-N5APF-ASCI6-2VBL3',  // 腾讯地图 逆地址解析 http://lbs.qq.com/webservice_v1/guide-gcoder.html
      location: `${coords.latitude},${coords.longitude}`, // '116.480881,39.989410'
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
      reject()
    })
  })
}

// 判断消费者 所在位置 超出配送范围
let isOverdist = (coords) => {
  return new Promise((resolve, reject) => {
    store.commit('UPDATEADDRESS', '未获取到地理位置')
    Vue.http({
      url: `${config.apiHost}diancan/c/is_overdist`,
      params: {
        mchnt_id: sessionStorage.getItem('mchntId'),
        longitude: coords.longitude,
        latitude: coords.latitude,
        format: 'cors'
      }
    })
    .then((res) => {
      let data = res.data
      if (data.respcd === '0000') {
        let formattedAddress = data.data.overdist ? '超出配送范围' : '未获取到地理位置'
        store.commit('UPDATEADDRESS', formattedAddress)
        window.localStorage.setItem('formatted_address', formattedAddress)
        resolve(data.data.overdist)
      }
    })
    .catch(() => {
      reject()
    })
  })
}

Wechat.getFormattedAddress = async () => {
  let coords = await Wechat.getCoords()
  await getFormattedAddress(false, coords)
}

Wechat.getOverdistFormattedAddress = () => {
  Wechat.getCoords().then((res) => {
    isOverdist(res).then((msg) => {
      let coords = {}
      coords.longitude = window.localStorage.getItem('longitude')
      coords.latitude = window.localStorage.getItem('latitude')
      if (!msg) {
        getFormattedAddress(msg, coords)
      }
    })
  })
  // let coords = await Wechat.getCoords()
  // let overdist = await isOverdist(coords)
  // await getFormattedAddress(overdist, coords)
}

export { WechatPlugin, Wechat }

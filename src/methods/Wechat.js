import Wechat from './wechat/index.js'

const WechatPlugin = (Vue) => {
  Vue.prototype.$wechat = Wechat
}

export { WechatPlugin, Wechat }

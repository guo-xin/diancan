/**
 * 微信相关
 * Created by aidenZou on 16/6/17.
 */

import Util from './Util'
import Config from './Config'

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

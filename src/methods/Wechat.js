/**
 * 微信相关
 * Created by aidenZou on 16/6/17.
 */

import Util from './Util'

exports.verify = function () {
  // let code = util.getQuery(location.href).code;
  let params = Util.getRequestParams(window.location.search)
  console.log(params)
  let code = params.code || ''
  let openid = params.openid || window.localStorage.getItem('openid') || ''

  console.log('LOG-------', 'code:', code, 'openid:', openid)
  if (openid) {
    window.localStorage.setItem('openid', openid)
    let redirectUri = window.localStorage.getItem('redirect_uri')
    if (redirectUri) {
      window.localStorage.setItem('redirect_uri', '')
      window.location.href = decodeURIComponent(redirectUri)
    }
    return
  }
  if (code) {
    console.log('....code...')
    // let host = 'http://api.haojin.in/'
    let host = 'https://qtapi.qa.qfpay.net/'
    window.location.href = host + 'diancan/weixincallback?redirect_url=' + encodeURIComponent(window.location.origin + window.location.pathname + '?') + '&code=' + code
  } else {
    window.localStorage.setItem('redirect_uri', encodeURIComponent(window.location.href))
    // wxeb6e671f5571abce
    // wx087a3fc3f3757766
    // window.location.href = 'https://o2.qfpay.com/trade/wechat/v1/get_weixin_code?appid=wx087a3fc3f3757766&redirect_uri=' + window.localStorage.redirect_uri + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
    // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx087a3fc3f3757766&redirect_uri=' + window.localStorage.getItem('redirect_uri') + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx087a3fc3f3757766&redirect_uri=' + encodeURIComponent(window.location.origin + window.location.pathname) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
  }
  // if (!code) {
  //   window.localStorage.redirect_uri = encodeURIComponent(window.location.href)
  //   // wxeb6e671f5571abce
  //   // wx087a3fc3f3757766
  //   window.location.href = 'https://o2.qfpay.com/trade/wechat/v1/get_weixin_code?appid=wx087a3fc3f3757766&redirect_uri=' + window.localStorage.redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
  // } else {
  //   let host = 'http://api.haojin.in/'
  //   window.location.href = host + 'wx_callback?redirect_url=' + window.localStorage.redirect_uri + '&code=' + code
  // }
}

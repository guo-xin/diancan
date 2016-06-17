/**
 * 微信相关
 * Created by aidenZou on 16/6/17.
 */

import Util from './Util'

exports.verify = function () {
  // let code = util.getQuery(location.href).code;
  let code = Util.getRequestParams(window.location.href).code
  if (!code) {
    window.localStorage.redirect_uri = encodeURIComponent(window.location.href)
    window.location.href = 'https://o2.qfpay.com/trade/wechat/v1/get_weixin_code?appid=wxeb6e671f5571abce&redirect_uri=' + window.localStorage.redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
  } else {
    let host = 'http://api.haojin.in/'
    window.ocation.href = host + 'wx_callback?redirect_url=' + window.localStorage.redirect_uri + '&code=' + code
  }
}

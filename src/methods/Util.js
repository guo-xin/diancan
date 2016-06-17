/**
 * Created by aidenZou on 16/5/5.
 */

let isWX = function () {
  var ua = navigator.userAgent
  return (/MicroMessenger/i).test(ua)
}

let isAPP = function () {
  var ua = navigator.userAgent
  return (/QMMWD/i).test(ua)
}

// 获取 url 请求参数
let getRequestParams = function (url) {
  url = url || window.location.search
  url = decodeURIComponent(url)
  var Request = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    let strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      var _key = strs[i].split('=')[0]
      _key && (Request[_key] = strs[i].split('=')[1])
    }
  }
  return Request
}

// 检查邮箱格式
let checkEmail = function (email) {
  var correctEmail = /^([a-zA-Z0-9]+[_|\|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return correctEmail.test(email)
}

exports.isWX = isWX()
exports.isAPP = isAPP()
exports.getRequestParams = getRequestParams
exports.checkEmail = checkEmail

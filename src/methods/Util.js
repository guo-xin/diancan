/**
 * Created by aidenZou on 16/5/5.
 */

const ua = navigator.userAgent

let isWX = function () {
  return (/MicroMessenger/i).test(ua)
}

let isAPP = function () {
  return (/QMMWD/i).test(ua)
}

let isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

let setTitle = (title) => {
  document.title = title
  if (isIOS) {
    let iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.setAttribute('src', 'https://m.baidu.com/favicon.ico')
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 0)
    }
    document.body.appendChild(iframe)
  }
}

let getUrlRouteParams = function (param) {
  let url = window.location.href
  url = decodeURIComponent(url)
  let str = url.substring(url.indexOf('!/') + 2, url.length)
  let strs = str.split('/')
  let Request = ''
  for (let i = 0; i < strs.length; i++) {
    if (strs[i] === param) {
      Request = strs[i + 1]
    }
  }
  return Request
}

let isEmptyObject = function (obj) {
  var value
  for (value in obj) {
    if (value) return false
  }
  return true
}
let getRequestParams = function (url) {
  url = url || window.location.search
  url = decodeURIComponent(url)
  var Request = {}
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    // var len = url.indexOf('?')
    // var str = url.slice(len + 1)
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
exports.isIOS = isIOS
exports.getUrlRouteParams = getUrlRouteParams
exports.getRequestParams = getRequestParams
exports.checkEmail = checkEmail
exports.setTitle = setTitle
exports.isEmptyObject = isEmptyObject

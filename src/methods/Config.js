/* global */
/**
 * 环境
 * production: 生产环境（默认）
 */

const test = process.env.NODE_ENV === 'testing'
const dev = process.env.NODE_ENV === 'development'

// 生产环境,线上配置
let rootHost = 'https://o.qfpay.com/dc/'
let payHost = 'https://openapi.qfpay.com/'
let apiHost = 'https://o.qfpay.com/'
let dcHost = 'https://o.qfpay.com/'
let o2Host = 'https://o2.qfpay.com/'  // 获取微信openid
let wxmpHost = 'https://wxmp.qfpay.com/'  // 获取微信分享
let mHost = 'https://marketing.qfpay.com/'

// let appid = 'wxeb6e671f5571abce'  // 公众号ID

// 测试配置
if (test) {
  rootHost = 'https://o.qa.qfpay.net/dc/'
  payHost = 'https://openapi.qa.qfpay.net/'
  apiHost = 'https://o.qa.qfpay.net/'
  dcHost = 'https://o.qa.qfpay.net/'
  o2Host = 'https://o2.qa.qfpay.net/'
  wxmpHost = 'https://wxmp.qa.qfpay.net/'
  mHost = 'https://marketing.qa.qfpay.net/'
  // appid = 'wx087a3fc3f3757766'  // 公众号ID
}

// 开发配置
if (dev) {
  rootHost = 'https://fe.qa.qfpay.net/'
  payHost = 'https://openapi.qa.qfpay.net/'
  apiHost = 'https://o.qa.qfpay.net/'
  dcHost = 'https://o.qa.qfpay.net/'
  o2Host = 'https://o2.qa.qfpay.net/'
  wxmpHost = 'https://wxmp.qa.qfpay.net/'
  mHost = 'https://marketing.qa.qfpay.net/'
}

module.exports = {
  rootHost,
  apiHost,
  payHost,
  o2Host,
  wxmpHost,
  dcHost,
  mHost,
  env: process.env.NODE_ENV,
  // appid,
  code: {
    OK: '0000', // 成功
    DBERR: '2000', // 数据库查询错误
    THIRDERR: '2001', // 第三方系统错误
    SESSIONERR: '2002', // 用户未登录
    DATAERR: '2003', // 数据错误
    IOERR: '2004', // 文件读写错误
    LOGINERR: '2100', // 用户登录失败
    PARAMERR: '2101', // 参数错误
    USERERR: '2102', // 用户不存在或未激活
    ROLEERR: '2103', // 用户身份错误
    // ROLEERR: '2103', // 密码错误
    REQERR: '2200', // 非法请求或请求次数受限
    IPERR: '2201', // IP受限
    NODATA: '2300', // 无数据
    DATAEXIST: '2301', // 数据已存在
    UNKOWNERR: '2400', // 未知错误
    VERIFYCODE: '1001', //    验证码不正确
    REGISTERERR: '1000' //    注册失败
  }
  // OPENID: 'diancan_openid_' + appid
}

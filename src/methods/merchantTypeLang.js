// 不同的商户类型 展示不同的文案，现只有 餐厅和商品 两类
const shop = {
  name: '商品',
  number: '订单号',
  eatin: '',
  pageTitle: '微信商城',
  location: '位置',
  sorry: '页面已经过期',
  again: '请重新扫描二维码下单哦'
}
const restaurant = {
  name: '菜单',
  number: '取餐号',
  eatin: '堂食',
  pageTitle: '微信点餐',
  location: '桌号',
  sorry: '对不起，我们还不清楚你坐在哪个位置',
  again: '请扫一扫桌上的二维码，开始点餐'
}

export {shop, restaurant}

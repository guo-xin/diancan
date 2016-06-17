/**
 * Created by aidenZou on 16/6/12.
 */

// var Mock = require('mockjs')
import Mock from 'mockjs'

let goodsList = Mock.mock({
  'goods|5-10': [{  // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'cate_id|+1': 1,  // 属性 id 是一个自增数，起始值为 1，每次增 1
    // cate: Mock.Random.ctitle(2, 8),
    // cate: Mock.mock('@ctitle(2, 8)'),
    cate: '@ctitle(2,8)',
    // 'goods_list': [{
    'goods_list|10-30': [{
      'id|+1': 100,
      // 'cate_id|+1': 1,
      'cate_id': 1,
      // 'cate_id': function () {
      //   console.log(this)
      //   return this.cate_id
      // },
      // 'cate_id': '@/goods/cate',
      // 'cate_id': '@../../cate_id',
      name: '@ctitle(5,10)',
      img: 'http://map.baidu.com/maps/services/thumbnails?width=172&height=172&quality=60&src=http://img.waimai.bdimg.com/pb/9ea040fd3fb253ca4dccbdaada4ab156be&align=center%2Ccenter',
      // txamt: 10,
      'txamt|10-10000': 1
    }]
  }]
})

// 输出结果
// console.log('mockjs:goods_list', JSON.stringify(goodsList, null, 4))

// 订单详情
let orderDetail = {
  note: '不要放葱，不要放蒜，青椒和胡椒也不要...',
  orderinfo: {
    order_id: '9234323432432',
    address: '7号桌',
    order_sn: '002',
    create_time: '1465799869',
    pay_time: '1465799879',
    shop_name: '湘当里手（望京soho店）'
  },
  txamt: 3899,
  goods_list: [
    {
      goods: [
        {
          count: 1,
          price: 10,
          cate_id: 1,
          id: 1,
          name: '花生'
        }
      ],
      cate_id: 1,
      cate: '小菜'
    },
    {
      goods: [
        {
          count: 2,
          price: 20,
          cate_id: 2,
          id: 2,
          name: '青椒肉丝'
        },
        {
          count: 1,
          price: 20,
          cate_id: 2,
          id: 3,
          name: '黑椒牛柳'
        }
      ],
      cate_id: 2,
      cate: '套餐'
    }
  ]
}

// 支付参数
let checkout = {
  'pay_type': '800207',
  'sysdtm': '2016-06-16 14:22:06',
  'cardcd': '',
  'txdtm': '2016-06-16 14:22:06',
  'resperr': '\u4ea4\u6613\u6210\u529f',
  'txcurrcd': 'CNY',
  'txamt': '2',
  'respmsg': '',
  'out_trade_no': '6152550879295567701',
  'syssn': '20160616124500020003834151',
  'respcd': '0000',
  'pay_params': {
    'package': 'prepay_id=wx2016061614220877cadc465a0142239685',
    'timeStamp': '1466058128',
    'signType': 'MD5',
    'paySign': '73A3D8748DE22AD29D0A5D7760B8BDB3',
    'appId': 'wx370e5f2f9001f90b',
    'nonceStr': '86449f6f7ada4ab79e1c7570257faac7'
  }
}

export default {
  goods_list: goodsList,
  order_detail: orderDetail,
  checkout: checkout
}

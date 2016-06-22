<template>
  <div class="order-detail-view">
    <div class="c-loading-container" v-if="$loadingRouteData">
      <loading :visible="$loadingRouteData"></loading>
    </div>
    <section class="order-info">
      <div class="l-r-lr">
        <h2 class="shopname">{{order.orderinfo.shop_name}}</h2>
        <div class="num" v-show="order.orderinfo.address">{{order.orderinfo.address}}号桌</div>
      </div>
      <p>流&nbsp;&nbsp;水&nbsp;&nbsp;号：{{order.orderinfo.order_sn}}</p>
      <p>订单编号：{{order.orderinfo.order_id}}</p>
      <p>购买时间：{{order.orderinfo.pay_time | formatTime 'yyyy-MM-dd hh:mm'}}</p>
    </section>
    <ul class="goods-list">
      <li v-for="group in order.goods_list">
        <h2>{{group.cate}}</h2>
        <div class="l-r-lr goods" v-for="goods in group.goods">
          <div class="name">{{goods.name}}</div>
          <div class="price"><em class="dollar">¥&nbsp;</em>{{goods.txamt | formatCurrency}}&nbsp;×&nbsp;{{goods.count}}</div>
        </div>
      </li>
    </ul>
    <section class="remarks" v-if="order.orderinfo.note">
      <h2>备注</h2>
      <div>{{order.orderinfo.note}}</div>
    </section>

    <div class="l-c-c allPrice">
      <span>总价</span>&nbsp;
      <div><em class="dollar">¥</em>&nbsp;{{order.orderinfo.txamt|formatCurrency}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from '../components/loading/Loading'
  import Config from '../methods/Config'

  //  import Api from '../api/mock'

  export default {
    components: {
      Loading
    },
    data () {
      return {
        order: {
          orderinfo: ''
        },
        type: 'android'
      }
    },
    computed: {
      cart () {
      }
    },
    created () {
//      let Api = require('../api/mock')
//      this.$set('order', Api.order_detail)
    },
    ready () {
      document.getElementsByClassName('view-container')[0].style.minHeight = window.innerHeight + 'px'
    },
    route: {
      data (transition) {
        let args = this.$route.params
        /**
         * order_id     // 订单id
         * mchnt_id     // 商户id
         * customer_id  // 用户id(去掉)
         */
        args.format = 'jsonp'
        this.$http({
          url: Config.apiHost + 'diancan/c/order_detail',
          method: 'JSONP',
          data: args
        }).then(function (response) {
          // success callback
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$dispatch('on-toast', data.respmsg)
            // transition.abort()
            return
          }
          transition.next({order: data.data})
        }, function (response) {
          // error callback
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .c-loading-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    z-index: 999;
  }

  section {
    padding: 30px;
  }

  .order-detail-view {
    padding-bottom: 120px;
    background-color: #F7F7F7;
  }

  .order-info {
    position: relative;
    background: #e5e5e5;
    .shopname {
      font-size: 34px;
      color: #2F323A;
    }
    .num {
      font-size: 40px;
      color: #FE9B20;
    }
    p {
      margin-top: 16px;
      font-size: 26px;
      color: #8a8c92;
    }
  }

  .goods-list {
    padding: 0 0 0 30px;
    h2 {
      margin-top: 26px;
      font-size: 30px;
      color: #8A8C92;
    }
    .goods {
      padding: 30px;
      padding-left: 0;
      border-bottom: 2px solid #e5e5e5; /*px*/
    }
    .name {
      font-size: 34px;
      line-height: 34px;
      color: #2f323a;
    }
    .price {
      font-size: 40px;
      color: #8A8C92;
      line-height: 34px;
    }
  }

  /*备注*/
  .remarks {
    h2 {
      margin-bottom: 24px;
      font-size: 30px;
      color: #8A8C92;
    }
    div {
      padding: 30px;
      border-radius: 6px;
      font-size: 30px;
      line-height: 1.5;
      background: #EFEFEF;
      color: #8a8c92;
    }
  }

  .allPrice {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    height: 104px;
    span {
      font-size: 26px;
      color: #2F323A;
    }
    div {
      font-size: 40px;
      color: #FE9B20;
    }
  }
</style>

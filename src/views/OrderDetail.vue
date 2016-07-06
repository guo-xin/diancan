<template>
  <div class="order-detail-view">
    <div class="c-loading-container" v-if="$loadingRouteData">
      <loading :visible="$loadingRouteData"></loading>
    </div>
    <section class="shop">
      <div class="l-r">
        <h2 class="l_auto shopname">{{order.orderinfo.shop_name}}</h2>
        <div class="num" v-show="order.orderinfo.address">{{order.orderinfo.address}}号桌</div>
      </div>
    </section>
    <section class="order_sn">
      <h3>取餐号</h3>
      <p class="f-40 order_sn_num">{{order.orderinfo.order_sn}}</p>
      <p class="order_sn_text">请留意餐厅叫号，及时取餐哦～</p>
    </section>
    <ul class="goods-list">
      <li v-for="group in order.goods_list">
        <!--<h2>{{group.cate}}</h2>-->
        <div class="l-r goods" v-for="goods in group.goods">
          <div class="l_auto name">{{goods.name}}</div>
          <div class="price"><em class="dollar">¥&nbsp;</em>{{goods.txamt | formatCurrency}}<span>&nbsp;×&nbsp;{{goods.count}}</span>
          </div>
        </div>
      </li>
      <li>
        <div class="l-r">
          <div class="l_auto name">总价</div>
          <div class="allPrice"><em class="dollar">¥</em>&nbsp;{{order.orderinfo.txamt|formatCurrency}}</div>
        </div>
      </li>
    </ul>
    <section class="remarks" v-if="order.orderinfo.note">
      <h2>备注</h2>
      <div>{{order.orderinfo.note}}</div>
    </section>
    <section class="order-info">
      <ul>
        <li>订单编号：{{order.orderinfo.order_id}}</li>
        <li>购买时间：{{order.orderinfo.pay_time | formatTime 'yyyy-MM-dd hh:mm'}}</li>
      </ul>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import Util from '../methods/Util'
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
          const shopname = data.data.orderinfo.shop_name
          Util.setTitle(shopname)
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

  .f-40 {
    font-size: 40px !important;
  }

  section {
    padding: 30px;
  }

  .order-detail-view {
    background-color: #F7F7F7;
  }

  .shop {
    .shopname {
      font-size: 34px;
      color: #2F323A;
    }
    .num {
      font-size: 30px;
      color: #8A8C92;
    }
  }

  .order_sn {
    margin: 30px;
    margin-top: 10px;
    margin-bottom: 20px;
    padding-top: 16px;
    background: #F7F7F7;
    border: 2px solid #FE9B20; /*px*/
    border-radius: 8px;
    text-align: center;
    font-size: 30px;
    h3 {
      font-weight: normal;
      line-height: 56px;
      color: #9B9DA3;
    }
    p {
      color: #2F323A;
    }
    .order_sn_num {
      line-height: 56px;
    }
    .order_sn_text {
      margin-top: 20px;
      padding-top: 30px;
      border-top: 2px solid #FFDCB1; /*px*/
      color: #FE9B20;
    }
  }

  .goods-list {
    padding: 0 0 0 30px;
    h2 {
      margin-top: 26px;
      font-size: 30px;
      color: #8A8C92;
    }
    li > div {
      padding: 30px;
      align-items: center;
      padding-left: 0;
      border-bottom: 2px solid #e5e5e5; /*px*/
    }
    .name {
      margin-right: 5px;
      font-size: 30px;
      line-height: 30px;
      color: #2F323A;
    }
    .price {
      width: 210px;
      text-align: right;
      font-size: 34px;
      color: #8A8C92;
      line-height: 34px;
      span {
        font-size: 75%;
      }
    }
    .allPrice {
      font-size: 40px;
      color: #FE9B20;
    }
  }

  /*备注*/
  .remarks {
    padding-bottom: 0;
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

  .order-info {
    font-size: 26px;
    color: #8A8C92;
  }
</style>

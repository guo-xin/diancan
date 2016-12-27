<template>
  <div class="order-detail-view">
    <div class="c-loading-container" v-if="$loadingRouteData">
      <loading :visible="$loadingRouteData"></loading>
    </div>
    <section class="shop">
      <h2 class="l_auto shopname">{{order.orderinfo.shop_name}}</h2>
      <p><i>电话 </i>{{order.orderinfo.merchant_info.mobile}} <a href="tel:{{order.orderinfo.merchant_info.mobile}}">联系商家</a></p>
    </section>
    <div class="delivery-status">
      <ul :style="backgroundObj">
        <li v-for="item in order.orderinfo.delivery_info.info">
          <p>{{item.ctime | formatTime 'hh:mm'}}</p>
          <p v-if="item.delivery_state==0">付款</p>
          <p v-if="item.delivery_state==1">接单</p>
          <p v-if="item.delivery_state==2">发货</p>
          <p v-if="item.delivery_state==3">送达</p>
        </li>
      </ul>
    </div>
    <div>
      <section class="delivery-info">
        <h3>配送信息</h3>
        <ul>
          <li>
            <i>联系人</i>
            <span>{{order.orderinfo.customer_info.contact_name}} {{order.orderinfo.customer_info.mobile}}</span>
          </li>
          <li>
            <i>配送地址</i>
            <span>{{order.orderinfo.customer_info.detail_addr}}</span>
          </li>
        </ul>
      </section>
      <ul class="goods-list">
        <li v-for="group in order.goods_list">
          <!--<h2>{{group.cate}}</h2>-->
          <div class="l-r goods" v-for="goods in group.goods">
            <div class="l_auto">
              <div class="name">{{goods.name}}</div>
              <div class="specname">{{goods.spec_name}}</div>
            </div>
            <div class="price"><em class="dollar">¥&nbsp;</em>{{goods.txamt | formatCurrency}}<span>&nbsp;×&nbsp;{{goods.count}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="b-top count">
        <div class="extra-info">
          <p>配送费 <span class="free">￥<i>{{order.orderinfo.shipping_fee | formatCurrency}}</i></span></p>
        </div>
        <div class="l-r count-amt">
          <div class="l_auto name">总价</div>
          <div class="allPrice"><em class="dollar">¥</em>&nbsp;{{order.orderinfo.txamt|formatCurrency}}</div>
        </div>
      </div>
      <section class="remarks b-top" v-if="order.orderinfo.note">
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
  </div>
</template>

<script type="text/ecmascript-6">
  import Util from '../../../methods/Util'
  import Loading from '../../../components/loading/Loading'
  import Config from '../../../methods/Config'
  import img0 from '../assets/img_progress_0.png'
  import img1 from '../assets/img_progress_1.png'
  import img2 from '../assets/img_progress_2.png'
  import img3 from '../assets/img_progress_3.png'
  //  import Api from '../api/mock'

  export default {
    components: {
      Loading
    },
    data () {
      return {
        order: {
          orderinfo: {
            delivery_info: '',
            merchant_info: {
              mobile: ''
            },
            customer_info: {
            }
          }
        },
        type: 'android',
        deliveryImg: ''
      }
    },
    computed: {
      cart () {
      },
      backgroundObj () {
        return {
          backgroundImage: 'url(' + this.deliveryImg + ')',
          backgroundSize: '100%',
          fontSize: '30px'
        }
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
          url: Config.dcHost + 'diancan/c/order_detail',
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
          switch (this.order.orderinfo.delivery_info.current_state) {
            case 0: {
              this.deliveryImg = img0
              break
            }
            case 1: {
              this.deliveryImg = img1
              break
            }
            case 2: {
              this.deliveryImg = img2
              break
            }
            case 3: {
              this.deliveryImg = img3
              break
            }
          }
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

  .b-top {
    border-top: 2px solid #E5E5E5; /*px*/
  }
  section {
    padding: 30px;
  }

  .order-detail-view {
    background-color: #F7F7F7;
  }
  .count {
    margin-left: 30px;
  }
  .extra-info {
    padding-left: 0;
    p {
      padding: 30px 30px 40px 0;
      font-size: 30px;
      color: #2F323A;
      span {
        float: right;
        font-size: 26px;
        color: #FE9B20;
        &.free {
          color: #8A8C92;
        }
        i {
          font-size: 34px;
          font-style: normal;
          text-decoration: none;
        }
      }
    }
  }
  .shop {
    padding-bottom: 0;
    .shopname {
      font-size: 34px;
      color: #2F323A;
    }
    p {
      color: #2F323A;
      font-size: 30px;
      line-height: 64px;
      margin: 16px 0;
      i {
        color: #8A8C92;
        font-style: normal;
      }
      a {
        float: right;
        display: block;
        width: 180px;
        height: 64px;
        border-radius: 6px;
        font-size: 30px;
        color: #FE9B20;
        text-align: center;
        line-height: 64px;
        border: 2px solid #FE9B20;
      }
    }
  }
  .delivery-status {
    position: relative;
    height: 144px;
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 144px;
    }
    ul {
      display: flex;
      align-items: center;
      height: 144px;
      li {
        width: 125px;
        p {
          text-align: center;
          color: #FFFFFF;
          font-size: 24px;
        }
      }
    }
  }
  .delivery-info {
    padding-top: 0;
    h3 {
      color: #8A8C92;
      font-size: 30px;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    ul {
      background-color: #fff;
      border-radius: 6px;
      padding: 0 30px;
      li {
        min-height: 80px;
        line-height: 80px;
        font-size: 30px;
        display: flex;
        &:not(:nth-last-of-type(1)) {
          border-bottom: 2px solid #EFEFEF;
        }
        i {
          font-style: normal;
          color: #8A8C92;
          margin-right: 36px;
        }
        span {
          color: #2F323A;
          flex: 1;
          padding: 19px 0;
          text-align: right;
          line-height: 1.4;
        }
      }
    }
  }
  .show_detail {
    position: relative;
    text-align: center;
    font-size: 30px;
    color: #8A8C92;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      margin-left: 20px;
      width: 30px;
      height: 16px;
      transition: all .3s ease-in-out;
    }
    &.activate .icon {
      transform: rotate(180deg);
    }
    &:before, &:after {
      content: '';
      position: absolute;
      top: 50%;
      width: 200px;
      height: 2px;
      background: #E5E5E5;
    }
    &:before {
      left: 30px;
    }
    &:after {
      right: 30px;
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
      /*border-bottom: 2px solid #e5e5e5; !*px*!*/
    }
    .name {
      margin-right: 5px;
      font-size: 30px;
      line-height: 30px;
      color: #2F323A;
    }
    .specname {
      margin-top: 15px;
      font-size: 26px;
      color: #8A8C92;
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
  }
  .count-amt {
    padding: 0 30px 30px 0;
    .allPrice {
      font-size: 40px;
      color: #FE9B20;
    }
    .name {
      margin-right: 5px;
      font-size: 34px;
      line-height: 1;
      color: #2F323A;
    }
  }

  /*备注*/
  .remarks {
    padding-bottom: 0;
    padding-left: 0;
    margin-left: 30px;
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
    li {
      margin-bottom: 16px;
    }
  }
</style>

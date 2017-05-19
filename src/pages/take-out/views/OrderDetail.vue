<template>
  <div class="order-detail-view">
    <div class="c-loading-container" v-if="$loadingRouteData">
      <loading :visible="$loadingRouteData"></loading>
    </div>
    <section class="delivery-status">
      <ul :style="backgroundObj">
        <li v-for="item in order.orderinfo.delivery_info.info">
          <p>{{item.ctime | formatTime 'hh:mm'}}</p>
          <p v-if="item.delivery_state==0">付款</p>
          <p v-if="item.delivery_state==1">接单</p>
          <p v-if="item.delivery_state==2">发货</p>
          <p v-if="item.delivery_state==3">送达</p>
        </li>
      </ul>
    </section>
    <section class="delivery-address item">
      <p>{{order.orderinfo.customer_info.contact_name}}　{{order.orderinfo.customer_info.mobile}}</p>
      <p>{{order.orderinfo.customer_info.detail_addr}}</p>
    </section>
    <section class="order-info item">
      <p>订单编号：<span>{{order.orderinfo.order_id}}</span></p>
      <p>购买时间：<span>{{order.orderinfo.pay_time | formatTime 'yyyy-MM-dd hh:mm'}}</span></p>
      <button type="button">取消订单</button>
    </section>
    <section class="order-content item">
      <ul class="goods-list">
        <li v-for="group in order.goods_list">
          <div v-for="goods in group.goods">
            <div class="goods-name" >
              <strong>{{goods.name}}</strong>
              <em>{{goods.spec_name}}</em>
            </div>
            <span><sub>￥</sub>{{goods.txamt | formatCurrency}}<em>&nbsp;x&nbsp;{{goods.count}}</em></span>
          </div>
        </li>
      </ul>
      <div class="deliver-fee">
        <div v-if="!deliver.originFee">
          配送费<span>（免费配送）</span>
        </div>
        <div v-else>
          配送费<span v-if="deliver.freeDeliverFee">（满{{deliver.freeDeliverFee | formatCurrency | noZeroCurrency}}免配送费）</span>
        </div>
        <span :class="{'free': cartData.price >= order.orderinfo.shipping_fee, 'hasfee': !order.orderinfo.shipping_fee && !deliver.originFee}">
          <sub>￥</sub>{{order.orderinfo.shipping_fee| formatCurrency}}
        </span>
      </div>
      <div class="total">
        <strong>总计</strong>
        <!-- <del>原价¥63</del> -->
        <span><sub>￥</sub>{{order.orderinfo.txamt | formatCurrency}}</span>
      </div>
      <div class="note">
        <p><em>备注：</em>不要放葱，不要放蒜，不要青椒</p>
      </div>
    </section>
    <section class="shop-info item">
      <div>
        <figure>
          <img src="http://near.m1img.com/op_upload/155/149432051742.png" alt="店铺图片">
        </figure>
        <div>
          <h2>{{order.orderinfo.shop_name}}</h2>
          <p>北京市朝阳区 望京SOHO 中心广场负一层1012</p>
        </div>
      </div>
      <a href="tel:{{order.orderinfo.merchant_info.mobile}}"><i class="icon-phone"></i></a>
    </section>
    <section class="follow">
      <p>长按二维码关注，<br/>获取更多店铺福利！</p>
      <img src="../assets/btn_add.svg" alt="扫码关注公众号">
    </section>
</template>

<script type="text/ecmascript-6">
  import Util from '../../../methods/Util'
  import Loading from '../../../components/loading/Loading'
  import Config from '../../../methods/Config'
  import img0 from '../assets/img_progress_0_white_label@2x.png'
  import img1 from '../assets/img_progress_1_white_label@2x.png'
  import img2 from '../assets/img_progress_2_white_label@2x.png'
  import img3 from '../assets/img_progress_3_white_label@2x.png'
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
      // let Api = require('../api/mock')
      // this.$set('order', Api.order_detail)
    },
    ready () {
      // document.getElementsByClassName('view-container')[0].style.minHeight = window.innerHeight + 'px'
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

<style lang="scss" rel="stylesheet/scss">
  @import "../../../styles/base/_base";
  .c-loading-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    z-index: 999;
  }
  .item {
    padding: 24px 30px;
    margin-bottom: 18px;
    background-color: #fff;
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
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
          color: #fff;
          font-size: 24px;
        }
      }
    }
  }
  .delivery-address {
    min-height: 130px;
    line-height: 1.4;
  }
  .order-content {
    padding: 30px;
  }
  .order-info {
    position: relative;
    line-height: 1.5;
    border-bottom: none;
    margin-bottom: 0;
    span {
      color: $aluminium;
    }
    button {
      color: $orange;
      padding: 0;
      background-color: transparent;
      border: none;
      position: absolute;
      right: 24px;
      top: 30px;
    }
  }
  .goods-list {
    li {
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 26px;
      }
    }
    .goods-name {
      strong {
        display: block;
      }
      em {
        font-size: 26px;
        color: $aluminium;
      }
    }
    span {
      font-size: 34px;
      em {
        font-size: 26px;
        color: $aluminium;
      }
    }
  }
  .deliver-fee {
    display: flex;
    margin-bottom: 26px;
    div {
      flex: 1;
    }
    > span {
      color: $orange;
      &.free {
        text-decoration: line-through;
      }
      &.hasfee {
        color: $black;
      }
    }
  }
  .total {
    margin-bottom: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 40px;
    }
    del {
      color: $aluminium;
      margin-right: 30px;
    }
    text-align: right;
  }
  .note {
    background-color: #F7F7F7;
    padding: 24px 20px;
    border-radius: 6px;
    color: $aluminium;
    em {
      color: $lightBlack;
    }
  }
  .shop-info {
    padding-top: 28px;
    padding-bottom: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      display: flex;
      figure {
        margin: 0;
        width: 106px;
        img {
          max-width: 100%;
          vertical-align: bottom;
        }
      }
      div {
        margin-left: 18px;
        p {
          color: $aluminium;
          font-size: 24px;
          margin-top: 10px;
          line-height: 1.5;
        }
      }
    }
    a {
      width: 66px;
      text-align: center;
      color: $orange;
    }
    i {
      font-size: 50px;
    }
  }
  .follow {
    height: 260px;
    background: url('../assets/follow-bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      text-align: right;
      margin-right: 30px;
    }
    img {
      width: 180px;
      height: 180px;
    }
  }
</style>

<template>
  <div class="order-detail-view">
    <div class="c-loading-container" v-if="isLoading">
      <loading :visible="isLoading"></loading>
    </div>
    <section class="delivery-status">
      <ul :style="backgroundObj">
        <li v-for="item in order.orderinfo.delivery_info.info">
          <p>{{item.ctime | formatTime('hh:mm')}}</p>
          <p v-if="item.delivery_state==0">付款</p>
          <p v-if="item.delivery_state==1">接单</p>
          <p v-if="item.delivery_state==2">发货</p>
          <p v-if="item.delivery_state==3">送达</p>
          <p v-if="item.delivery_state==4">取消</p>
        </li>
      </ul>
    </section>
    <section class="delivery-address item">
      <p>{{order.orderinfo.customer_info.contact_name}}　{{order.merchant_info.mobile}}</p>
      <p>{{order.orderinfo.customer_info.detail_addr}}</p>
    </section>
    <section class="order-info item">
      <p>订单编号：<span>{{order.orderinfo.order_id}}</span></p>
      <p>购买时间：<span>{{order.orderinfo.pay_time | formatTime('yyyy-MM-dd hh:mm')}}</span></p>
      <!-- <button type="button">取消订单</button> -->
    </section>
    <section class="order-content item">
      <ul class="goods-list">
        <li v-for="group in order.goods_list">
          <div v-for="goods in group.goods">
            <div class="goods-name" >
              <strong>{{goods.name}}</strong>
              <p><em>{{goods.spec_name}}</em><em v-for="attr in goods.attr_list">，{{attr.attr_value_list[0]}}</em></p>
            </div>
            <span><sub>￥</sub>{{goods.txamt | formatCurrency}}<em>&nbsp;x&nbsp;{{goods.count}}</em></span>
          </div>
        </li>
      </ul>
      <div class="deliver-fee">
        <em>配送费</em>
        <!-- 达达配送费 -->
        <!-- <span v-if="deliveryStatus">{{deliveryStatus}}</span> -->
        <span><sub>￥</sub>{{order.orderinfo.shipping_fee | formatCurrency}}</span>
      </div>
      <div class="total">
        <strong>总计</strong>
        <!-- <del>原价¥63</del> -->
        <span><sub>￥</sub>{{order.orderinfo.txamt | formatCurrency}}</span>
      </div>
      <div v-if="order.orderinfo.note" class="note-item">
        <p><em>备注：</em>{{order.orderinfo.note}}</p>
      </div>
    </section>
    <section class="shop-info item">
      <div>
        <figure>
          <img :src="(order.merchant_info.head_img ? order.merchant_info.head_img : 'http://near.m1img.com/op_upload/155/149432051742.png') + '?imageView2/1/w/200/h/150'" alt="店铺图片">
        </figure>
        <div>
          <h2>{{order.merchant_info.shop_name}}</h2>
          <p v-show="order.merchant_info.address"><i class="icon-marker"></i>{{order.merchant_info.address}}</p>
        </div>
      </div>
      <a :href="'tel:' + order.merchant_info.mobile"><i class="icon-phone"></i></a>
    </section>
    <!-- 接口不支持，先注释掉 -->
    <!-- <section class="follow">
      <p>长按二维码关注，<br/>获取更多店铺福利！</p>
      <img src="../assets/btn_add.svg" alt="扫码关注公众号">
    </section> -->
    <red-packet v-show="showRedPacket" @hideRedPacketView="hideRedPacketView"></red-packet>
    <get-points v-show="showGetPoints" @hidePointView></get-points>
  </div>
</template>

<script type="text/ecmascript-6">
  import Util from 'methods/Util'
  import Loading from 'components/loading/Loading'
  import Config from 'methods/Config'
  import img0 from '../assets/img_progress_0@2x.png'
  import img1 from '../assets/img_progress_1@2x.png'
  import img2 from '../assets/img_progress_2@2x.png'
  import img3 from '../assets/img_progress_3@2x.png'
  import img4 from '../assets/img_progress_4@2x.jpg'
  import RedPacket from '../../../components/RedPacket'
  import GetPoints from '../../../components/GetPoints'

  export default {
    components: {
      Loading, RedPacket, GetPoints
    },
    data () {
      return {
        isLoading: false,
        order: {
          orderinfo: {
            delivery_info: '',
            merchant_info: {
              mobile: ''
            },
            customer_info: {
            }
          },
          merchant_info: {
            head_img: '',
            address: ''
          }
        },
        type: 'android',
        deliveryImg: '',
        showRedPacket: false,
        showGetPoints: true
      }
    },
    computed: {
      backgroundObj () {
        return {
          backgroundImage: 'url(' + this.deliveryImg + ')',
          backgroundSize: '100%',
          fontSize: '30px'
        }
      }
    },
    methods: {
      hideRedPacketView () {
        this.showRedPacket = false
      },
      hidePointView () {
        this.showGetPoints = false
      }
    },
    created () {
      this.isLoading = true
      let args = this.$route.params
      console.log(args)
      /**
       * order_id     // 订单id
       * mchnt_id     // 商户id
       */
      args.format = 'jsonp'
      this.$http({
        url: Config.dcHost + 'diancan/c/order_detail',
        method: 'JSONP',
        params: args
      }).then(function (response) {
        this.isLoading = false
        let data = response.data
        if (data.respcd !== Config.code.OK) {
          this.$toast(data.respmsg)
          return
        }
        this.order = data.data
        switch (data.data.orderinfo.delivery_info.current_state) {
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
          case 4: {
            this.deliveryImg = img4
            break
          }
        }
        const shopname = data.data.merchant_info.shop_name
        Util.setTitle(shopname)
      })
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/base/_var";
  @import "../../../styles/iconfont/iconfont.css";
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
        &:first-child {
          width: 16%;
        }
        width: 18%;
        p {
          text-align: center;
          color: #fff;
          font-size: 24px;
        }
      }
    }
  }
  .delivery-address {
    padding-top: 30px;
    padding-bottom: 30px;
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
      top: 24px;
      right: 30px;
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
        font-weight: normal;
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 26px;
    > span {
      display: block;
      font-size: 32px;
      &.except {
        text-decoration: line-through;
      }
    }
  }
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    strong, span {
      display: block;
    }
    strong {
      font-weight: normal;
    }
    span {
      font-size: 40px;
    }
    del {
      color: $aluminium;
      margin-right: 30px;
    }
    text-align: right;
  }
  .note-item {
    margin-top: 36px;
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
          vertical-align: top;
        }
      }
      div {
        margin-left: 18px;
        h2 {
          font-size: 30px;
        }
        p {
          color: $aluminium;
          font-size: 24px;
          margin-top: 10px;
          line-height: 1.5;
        }
        i {
          color: $gray;
          font-size: 26px;
          vertical-align: -2px;
          margin-right: 10px;
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
    .cancel-order {
      &.cancel-style {
        display: none;
      }
      width: 180px;
      height: 64px;
      position: absolute;
      right: 30px;
      top: 40px;
      background-color: transparent;
      border: 2px solid #FE9B20;
      border-radius: 6px;
      color: #FE9B20;
      font-size: 30px;
      float: right;
      padding: 0;
    }
  }
</style>

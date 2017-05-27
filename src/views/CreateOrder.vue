<template>
  <div class="create-order-view">
    <section v-if="address === ':address'" class="fill-table-number item">
      <label for="table-number-input">桌号：</label>
      <input id="table-number-input" type="text" value="" placeholder="请填写餐桌号码（选填）"/>
    </section>
    <section v-else class="table-number">
      <strong>&#8901;<span>{{address}}号桌</span>&#8901;</strong>
    </section>

    <section class="note item">
      <label for="note">备注：</label>
      <textarea v-model="note" id="note" placeholder="可填写口味要求或忌口等信息"></textarea>
    </section>
    <section class="order item">
      <ul class="goods-list">
        <li v-for="goods in cart">
          <div>
            <strong>{{goods.name}}</strong>
            <em>{{goods.spec_list[goods._specIndex].name}}</em>
          </div>
          <span>￥{{goods.spec_list[goods._specIndex].txamt | formatCurrency}}<em>&nbsp;x&nbsp;{{goods.spec_list[goods._specIndex]._count}}</em></span>
        </li>
      </ul>
      <div class="total">
        <!-- <del>原价¥63</del> -->
        <span>总计&nbsp;&nbsp;¥&nbsp;<em>{{cartData.price | formatCurrency}}</em></span>
      </div>
    </section>
    <section class="payment item">
      <em>支付方式</em>
      <span><i></i>微信支付</span>
    </section>
    <button class="done-btn" @click.stop="createOrder" :disabled="btnText!=='确认下单'">{{btnText}}</button>
    <alert alert-title="温馨提示" :alert-tip="alertTip" :alert-visible.sync="alertVisible"></alert>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  /* eslint-disable */
  import Config from '../methods/Config'
  import { isWX } from '../methods/Util'
  import alert from '../components/alert/alert.vue'
  export default {
    props: ['cart'],
    components: {
      alert
    },
    data () {
      return {
        alertVisible: false,
        alertTip: '',
        mchnt_id: '',       // 商户ID
        address: '',        // 桌号
        note: '',           // 备注
        orderId: '',
        checkout: {},
        btnText: '确认下单'
      }
    },
    created () {
      let params = this.$route.params
      this.mchnt_id = params.mchnt_id
      this.address = params.address
    },
    computed: {
      cartData () {
        let count = 0
        let price = 0
        this.cart.forEach((goods, index) => {
          let spec = goods.spec_list[goods._specIndex]
          count += spec._count
          price += spec._count * spec.txamt
        })
        return {
          count,
          price
        }
      }
    },
    methods: {
      createOrder () {  // 创建订单
        /**
         * open_id
         * appid      // 商户appid
         * mchnt_id   // 商户id
         * address    // 桌号
         * note       // 备注
         * pay_way    // 支付方式: 'weixin'
         * pay_amt    // 付款金额
         * goods_info // 商品信息 json
         */
        this.btnText = '支付中'
        this.note = ('' + this.note).trim()
        let cart = this.cart || []
        let goodsItem = cart.map((goods) => {
          let spec = goods.spec_list[goods._specIndex]
          return {
            id: spec.id,
            count: spec._count
            // cate_id: goods.cate_id
          }
        })
        let args = {
          open_id: this.$root.user.open_id,
          appid: window.localStorage.getItem('dc_appid'),
          mchnt_id: this.mchnt_id,
          address: this.address,
          note: this.note,
          pay_way: 'weixin',
          pay_amt: this.cartData.price,
          goods_info: JSON.stringify(goodsItem),
          format: 'cors'
        }
        this.$http({
          url: Config.apiHost + 'diancan/c/makeorder',
          method: 'POST',
          data: args
        }).then((response) => {
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$dispatch('on-toast', data.respmsg)
            this.btnText = '确认下单'
            return
          }
          let orderId = data.data.out_trade_no
          this.orderId = orderId
//          this.$dispatch('on-toast', '订单创建成功：' + orderId)
          this.getPayArgs(data.data)
        }, (response) => {
          // error callback
        })
        _hmt.push(['_trackEvent', 'view-create_order', 'click-createOrderBtn'])
      },
      getPayArgs (args) {
        args.userid = 0
        args.pay_type = 800207
        args.type = 'h5'
//        args.format = 'cors'

        this.$http({
          url: Config.payHost + 'trade/v1/checkout',
          method: 'POST',
          data: args
        }).then((response) => {
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$dispatch('on-toast', data.resperr)
            this.btnText = '确认下单'
            return
          }
          this.pay(data.pay_params)
          this.checkout = data
        }, (response) => {
          // error callback
        })
      },
      pay (payParams) {
        if (!isWX) {  // 不是微信中打开
          this.$dispatch('on-toast', '支付失败，请在微信中打开')
          this.btnText = '确认下单'
          return
        }
        if (typeof payParams !== undefined) {
          payParams.timestamp = parseInt(payParams.timeStamp)
          alert(typeof payParams.timestamp)
          delete payParams.timeStamp
          delete payParams.appId
          alert(JSON.stringify(payParams))
        } else {
          alert('支付参数为空')
        }
        let _this = this
        let onBridgeReady = () => {
          window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', payParams,
            function (res) {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                _this.orderPaySuccess()
              } else if (res.err_msg === 'getBrandWCPayRequest:fail_no permission to execute') {
                _this.alertTip = '无法唤起微信支付!请关闭页面，重新下单即可正常使用。';
                _this.alertVisible = true;
                _this.btnText = '支付失败';
              } else {
                _this.orderPayFail()
              }
              return
            }
          )
        }
      },
      orderPaySuccess () {
        // 订单支付成功
        this.$dispatch('on-cleanCart', this.mchnt_id)
        this.queryOrder()
      },
      orderPayFail () {
        // 支付失败
        this.btnText = '确认下单'
      },
      queryOrder () {
        let args = {
          order_id: this.orderId,
          mchnt_id: this.mchnt_id,
          syssn: this.checkout.syssn,
          format: 'cors'
        }
        this.$http({
          url: Config.apiHost + 'diancan/c/check_pay',
          method: 'GET',
          data: args
        }).then((response) => {
          this.$router.replace({
            name: 'orderDetail',
            params: {
              'order_id': this.orderId,
              'mchnt_id': this.mchnt_id
            }
          })
        }, (response) => {
          this.$router.replace({
            name: 'orderDetail',
            params: {
              'order_id': this.orderId,
              'mchnt_id': this.mchnt_id
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../styles/base/_base";
  body {
    background-color: #f7f7f7;
  }
  .create-order-view {
    font-size: 28px;
    color: $black;
  }
  .item {
    padding: 24px 30px;
    margin-top: 18px;
    background-color: #fff;
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
  }
  .fill-table-number {
    display: flex;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
    input {
      flex: 1;
      padding: 24px 0;
      border: none;
      vertical-align: middle;
      &::placeholder {
        color: $midGray;
      }
      &:focus {
        outline: none;
      }
    }
  }
  .table-number {
    text-align: center;
    padding: 28px 0;
    line-height: 1;
    strong {
      color: $orange;
      font-size: 40px;
      span {
        margin: 0 14px;
      }
    }
  }
  .note {
    display: flex;
    label {
      line-height: 1.5;
    }
    textarea {
      flex: 1;
      border: none;
      line-height: 1.5;
      resize: none;
      &::placeholder {
        color: $midGray;
      }
    }
  }
  .order {
    padding: 0;
  }
  .goods-list {
    font-size: 30px;
    padding: 10px 30px;
    li {
      display: flex;
      line-height: 80px;
    }
    div {
      flex: 1;
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
  .total {
    border-top: 2px solid #E5E5E5;
    line-height: 90px;
    padding: 0 30px;
    del {
      color: $aluminium;
      margin-right: 30px;
    }
    em {
      font-size: 40px;
      line-height: 1;
    }
    text-align: right;
  }
  .payment {
    display: flex;
    span {
      i {
        width: 42px;
        height: 40px;
        margin-right: 16px;
        display: inline-block;
        vertical-align: middle;
        background: url('../assets/wechat.svg') no-repeat;
      }
      flex: 1;
      text-align: right;
    }
  }
  .done-btn {
    width: 100%;
    height: 88px;
    border: none;
    background-color: #FF8100;
    color: #fff;
    font-size: 32px;
    position: fixed;
    bottom: 0;
    left: 0;
  }
</style>

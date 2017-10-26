<template>
  <div class="create-order-view">
    <section v-if="hasAddress" class="table-number">
      <strong>&#8901;<span>{{address}}号桌</span>&#8901;</strong>
    </section>
    <section v-else class="fill-table-number item">
      <label for="table-number-input">桌号：</label>
      <input id="table-number-input" type="text" v-model="address" maxlength="8" placeholder="请填写餐桌号码（选填）"/>
    </section>
    <section class="note item">
      <label for="note">备注：</label>
      <textarea v-model="note" id="note" maxlength="70" placeholder="如有特殊要求，请告知商家，最多50字"></textarea>
    </section>
    <section class="order item">
      <ul class="goods-list">
        <li v-for="goods in carts">
          <div>
            <strong>{{goods.name}}</strong>
            <em>{{goods.spec.name}}{{goods.attrValuesString}}</em>
          </div>
          <span class="fee-count"><sub>￥</sub>{{goods.spec.txamt | formatCurrency}}<em>&nbsp;x&nbsp;{{goods.count}}</em></span>
        </li>
      </ul>
      <div v-if="coupon.amt && payType === '800207'" class="coupon">
        <em>店铺红包</em>
        <span>-<sub>￥</sub>{{coupon.amt | formatCurrency}}</span>
      </div>
      <div class="total">
        <del v-if="this.coupon.amt > 0 && payType === '800207'">原价<sub>￥</sub>{{this.cartData.price | formatCurrency}}</del>
        <span>总计&nbsp;&nbsp;¥&nbsp;<em>{{payAmt | formatCurrency}}</em></span>
      </div>
    </section>
    <section class="payment item">
      <div class="wechat" :class="{'active': payType === '800207'}" @click="choosePayment('800207')">
        <strong>
          <i class="icon-wechat"></i><span>微信支付</span>
        </strong>
        <i class="icon-checked"></i>
      </div>
      <div class="balance" :class="{'active': payType === '700000'}" @click="choosePayment('700000')">
        <strong :class="{'disabled': prepaid.balance < cartData.price}">
          <i class="icon-wallet"></i><span>余额支付<em>￥{{prepaid.balance | formatCurrency}}</em></span>
        </strong>
        <em v-if="!prepaid.balance">储值享优惠</em>
        <em v-else-if="prepaid.balance < cartData.price" class="red">余额不足</em>
        <i v-else class="icon-checked"></i>
      </div>
      <div class="chuzhi" v-if="prepaid.expired === 0" @click="goChuzhi()">
        <p>储值优惠，最高送{{prepaid.max_present_amt | formatCurrency | noZeroCurrency}}元</p><i class="icon-right-arrow"></i>
      </div>
    </section>
    <button class="done-btn" @click.stop="createOrder" :disabled="btnText!=='确认下单'">
      <em>¥{{payAmt | formatCurrency}}</em>&nbsp;{{btnText}}
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import Config from '../methods/Config'
  import { isWX } from '../methods/Util'
  import store from '../vuex/store'
  export default {
    data () {
      return {
        mchnt_id: '',       // 商户ID
        hasAddress: false,
        address: '',        // 桌号
        note: '',           // 备注
        orderId: '',
        checkout: {},
        btnText: '确认下单',
        preAmt: 0,
        prepaid: {},   // 储值信息
        payType: '800207',  // 支付方式 800207是微信，700000是储值
        coupon: {
          amt: 0,
          coupon_code: ''
        }
      }
    },
    created () {
      let params = this.$route.params
      let carts = JSON.parse(localStorage.getItem(`carts${params.mchnt_id}`)) // 购物车
      if (carts) {
        store.commit('GETCARTS', carts)
      }
      this.fetchCoupon(params.mchnt_id)
      let prepaid = JSON.parse(sessionStorage.getItem('prepaid'))  // 储值信息
      this.payType = prepaid.balance > this.cartData.price ? '700000' : '800207'  // 余额大于订单金额 默认选中余额支付
      this.prepaid = prepaid
      this.hasAddress = params.address !== ':address'
      this.mchnt_id = params.mchnt_id
      this.address = params.address && this.hasAddress ? decodeURIComponent(params.address) : ''
    },
    computed: {
      carts () {
        return this.$store.getters.getCarts
      },
      cartData () {
        let count = 0
        let price = 0
        this.carts.forEach((goods, index) => {
          let spec = goods.spec
          count += goods.count
          price += goods.count * spec.txamt
        })
        return {
          count,
          price
        }
      },
      payAmt () {
        let payAmt = this.cartData.price
        if (this.coupon.amt && this.payType === '800207') {
          payAmt -= this.coupon.amt
        }
        return payAmt
      }
    },
    methods: {
      fetchCoupon (mchntid) {
        this.$http({
          url: Config.apiHost + 'diancan/coupon/get_coupon_list',
          method: 'GET',
          params: {
            format: 'cors',
            mchnt_id: mchntid,
            txamt: this.cartData.price
          }
        }).then((response) => {
          let data = response.data
          if (data.respcd === Config.code.OK) {
            this.coupon.amt = data.data.amt
            this.coupon.coupon_code = data.data.coupon_code
          } else {
            this.$toast(data.respmsg)
          }
        })
      },
      choosePayment (payType) {
        if (this.prepaid.balance < this.payAmt) {
          return
        }
        this.payType = payType
      },
      goChuzhi () {
        let redirectUrl = encodeURIComponent(window.location.href)
        window.location.assign(`${this.prepaid.recharge_url}&src=diancan&cback=${redirectUrl}`)
      },
      createOrder () {  // 创建订单
        /**
         * open_id
         * appid      // 商户appid
         * mchnt_id   // 商户id
         * address    // 桌号
         * note       // 备注
         * pay_type    // 支付方式
         * pay_amt    // 付款金额
         * goods_info // 商品信息 json
         */
        this.btnText = '支付中...'
        this.note = ('' + this.note).trim()
        let goodsInfo = this.carts.map((goods) => {
          let spec = goods.spec
          return {
            id: spec.id,
            count: goods.count,
            attr_list: goods.attr_list || []
          }
        })
        let args = {
          open_id: this.$parent.user.open_id || sessionStorage.getItem('dc_openid'),
          appid: sessionStorage.getItem('dc_appid'),
          mchnt_id: this.mchnt_id,
          address: this.address,
          note: this.note,
          pay_amt: this.payAmt,
          pay_type: this.payType,
          goods_info: JSON.stringify(goodsInfo),
          coupon_code: '',
          format: 'cors'
        }
        if (this.payType === '800207') {
          args.coupon_code = this.coupon.coupon_code
        }
        this.$http({
          url: Config.apiHost + 'diancan/c/makeorder',
          method: 'POST',
          params: args
        }).then((response) => {
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$toast(data.respmsg)
            this.btnText = '确认下单'
            return
          }
          let orderId = data.data.out_trade_no
          this.orderId = orderId
          this.getPayArgs(data.data)
        }, (response) => {
          // error callback
        })
        _hmt.push(['_trackEvent', 'view-create_order', 'click-createOrderBtn'])
      },
      getPayArgs (args) {
        args.userid = 0
        args.pay_type = this.payType
        args.type = 'h5'
//        args.format = 'cors'

        this.$http({
          url: Config.payHost + 'trade/v1/checkout',
          method: 'POST',
          params: args
        }).then((response) => {
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$toast(data.resperr)
            this.btnText = '确认下单'
            return
          }
          this.checkout = data
          if (this.payType === '700000') {
            this.orderPaySuccess()
          } else {
            this.pay(data.pay_params)
          }
        }, (response) => {
          // error callback
        })
      },
      pay (payParams) {
        if (!isWX) {  // 不是微信中打开
          this.$toast('支付失败，请在微信中打开')
          this.btnText = '确认下单'
          return
        }
        let _this = this
        let onBridgeReady = () => {
          window.WeixinJSBridge.invoke('getBrandWCPayRequest', payParams,
            function (res) {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                _this.orderPaySuccess()
              } else if (res.err_msg === 'getBrandWCPayRequest:fail_no permission to execute') {
                _this.$messagebox('无法唤起微信支付', '请关闭页面，重新下单即可正常使用。')
                _this.btnText = '支付失败'
              } else {
                _this.orderPayFail()
              }
              return
            }
          )
        }

        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
          }
        } else {
          onBridgeReady()
        }
      },
      orderPayFail () {
        // 支付失败
        this.btnText = '确认下单'
      },
      orderPaySuccess () {
        let args = {
          order_id: this.orderId,
          mchnt_id: this.mchnt_id,
          syssn: this.checkout.syssn,
          format: 'cors'
        }
        this.$http({
          url: Config.apiHost + 'diancan/c/check_pay',
          method: 'GET',
          params: args
        }).then((response) => {
          let data = response.data
          if (data.respcd === Config.code.OK) {
            store.commit('CLEANCARTS')
            localStorage.removeItem(`carts${this.mchnt_id}`)
            this.$router.replace({
              name: 'orderDetail',
              params: {
                'order_id': this.orderId,
                'mchnt_id': this.mchnt_id
              }
            })
          } else {
            this.$toast(data.respmsg)
            this.btnText = '确定下单'
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/base/_var";
  body {
    background-color: #f7f7f7;
  }
  .create-order-view {
    font-size: 28px;
    color: $black;
    padding-bottom: 88px;
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
    display: -webkit-box;
    display: -webkit-flex;
    label {
      padding: 24px 0;
    }
    padding-top: 0;
    padding-bottom: 0;
    input {
      flex: 1;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      display: block;
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
      display: block;
      flex: 1;
      border: none;
      padding: 0;
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
    padding: 24px 30px 0;
    li {
      display: flex;
      align-items: center;
      padding-bottom: 24px;
    }
    div {
      flex: 1;
      margin-right: 40px;
      strong {
        font-weight: normal;
        display: block;
        line-height: 1.2;
      }
      em {
        font-size: 26px;
        color: $aluminium;
      }
    }
    .fee-count {
      font-size: 34px;
      em {
        font-size: 26px;
        color: $aluminium;
      }
    }
  }
  .coupon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px 30px;
    em, span {
      display: block;
    }
    em {
      font-size: 30px;
    }
    > span {
      font-size: 34px;
      color: $orange;
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
    padding: 0;
    padding-left: 30px;
    strong, > i {
      display: block;
    }
    strong {
      font-weight: normal;
      i {
        margin-right: 16px;
      }
      span, i {
        vertical-align: middle;
      }
    }
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      padding-right: 30px;
      &.wechat {
        .icon-wechat {
          font-size: 40px;
          color: $green;
        }
      }
      &.balance {
        border-top: 2px solid #E5E5E5;
        .icon-wallet {
          font-size: 36px;
          color: $orange;
        }
        em {
          color: $orange;
          margin-left: 10px;
        }
        .red {
          color: $red;
        }
        .disabled {
          color: $midGray;
          .icon-wallet, em {
            color: $midGray;
          }
        }
      }
      &.active {
        .icon-checked {
          background-color: $green;
          border-color: $green;
          color: #fff;
        }
      }
      .icon-checked {
        width: 30px;
        height: 30px;
        display: inline-block;
        line-height: 30px;
        font-size: 26px;
        color: transparent;
        border: 4px solid $midGray;
        border-radius: 100%;
      }
    }
    .chuzhi {
      background-color: #FFF0E2;
      color: $orange;
      padding: 18px 0;
      font-size: 24px;
      border-radius: 6px;
      margin-right: 30px;
      margin-bottom: 24px;
      padding-right: 30px;
      display: flex;
      p {
        text-align: center;
        flex: 1;
      }
      i {
        display: block;
      }
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
    &:disabled{
      background-color: #8A8C92;
    }
  }
</style>

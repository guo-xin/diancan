<template>
  <div class="create-order-view">
    <section v-if="!hasAddress" class="address add" @click="goAddAddress">
      <img src="../assets/btn_add.svg"><span>新增送餐地址</span>
    </section>
    <section v-else class="address content" @click="goList" :id="current_addr.addr_id">
      <p>{{current_addr.contact_name}}　{{current_addr.mobile}}</p>
      <p>{{current_addr.location}} {{current_addr.detail_addr}}</p>
      <p v-if="!current_addr.longitude" class="update-tip">需要升级地址</p>
      <p v-if="current_addr.longitude && current_addr.overdist" class="warn-tip"><i></i>超出配送范围</p>
    </section>
    <section class="note item">
      <label for="note">备注：</label>
      <textarea v-model="note" id="note" maxlength="70" placeholder="可填写口味要求或忌口等信息"></textarea>
    </section>
    <section class="goods item">
      <ul class="goods-list">
        <li v-for="goods in carts">
          <div>
            <strong>{{goods.name}}</strong>
            <em>{{goods.spec.name}}{{goods.attrValuesString}}</em>
          </div>
          <span><sub>￥</sub>{{goods.spec.txamt | formatCurrency}}<em>&nbsp;x&nbsp;{{goods.count}}</em></span>
        </li>
      </ul>
      <div class="deliver-fee">
        <em>配送费<span v-if="deliver.min_shipping_fee">（满{{deliver.min_shipping_fee | formatCurrency | noZeroCurrency}}元免配送费）</span></em>
        <span v-if="deliveryStatus">{{deliveryStatus}}</span>
        <span v-else :class="{'except': cartData.price >= deliver.min_shipping_fee && deliver.min_shipping_fee}"><sub>￥</sub>{{deliver.shipping_fee | formatCurrency}}</span>
      </div>
      <div class="total">
        <span>总计&nbsp;&nbsp;¥&nbsp;<em>{{payAmt | formatCurrency}}</em></span>
      </div>
    </section>
    <section class="payment item">
      <em>支付方式</em>
      <span><i></i>微信支付</span>
    </section>
    <button class="done-btn" @click.stop="reviewOrder" :disabled="btnText!=='确认下单'">
      <em>¥{{payAmt | formatCurrency}}</em>&nbsp;{{btnText}}
    </button>
  </div>
</template>
<script type="text/ecmascript-6">
  /* global _hmt */
  /* eslint-disable  */
  import Config from 'methods/Config'
  import Util from 'methods/Util'
  import store from '../../../vuex/store'
  export default {
    props: ['deliver'],
    data () {
      return {
        mchnt_id: '',       // 商户ID
        hasAddress: false,
        note: '',           // 备注
        orderId: '',        // 订单ID
        checkout: {},
        btnText: '确认下单',
        isDadaDeliver: false,
        dadaDeliveryFee: 0,
        third_order_id: '',   // 达达特需
        delivery_no: '',   // 达达特需
        deliveryStatus: '',    // 达达配送费状态
        getDeliverFeeTimestamp: 0
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$messagebox && this.$messagebox.close()
      next()
    },
    created () {
      let params = this.$route.params
      this.mchnt_id = params.mchnt_id
      this.isDadaDeliver = parseInt(sessionStorage.getItem('isDadaDeliver')) === 1
      this.$http({
        url: Config.dcHost + 'diancan/c/get_addr',
        method: 'JSONP',
        params: {
          format: 'jsonp',
          userid: this.mchnt_id
        }
      }).then(function (res) {
        let data = res.data
        if (data.respcd === '0000') {
          let _data = data.data.addr
          if (Util.isEmptyObject(_data)) {
            this.$parent.current_addr = {}
            return
          }
          this.hasAddress = true
          this.$parent.current_addr = _data
          if (this.isDadaDeliver) {
            this.getDeliverFee()
          }
        }
      })
    },
    computed: {
      carts () {
        return this.$store.getters.getCarts
      },
      cartData () {
        let count = 0
        let price = 0
        let carts = this.carts || []
        carts.forEach((goods, index) => {
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
        if (this.isDadaDeliver) {   // 达达配送费
          payAmt += this.dadaDeliveryFee
        } else if (this.deliver.shipping_fee && payAmt < this.deliver.min_shipping_fee) {
           payAmt += this.deliver.shipping_fee
         } else if (this.deliver.shipping_fee && this.deliver.min_shipping_fee === 0) {
           payAmt += this.deliver.shipping_fee
         }
        return payAmt
      },
      current_addr () {
        return this.$parent.current_addr
      }
    },
    methods: {
      getDeliverFee () { // 获取达达等第三方配送费
        this.deliveryStatus = '正在获取...'
        this.getDeliverFeeTimestamp = new Date().getTime()
        let current_addr = this.current_addr
        this.third_order_id = `${this.mchnt_id}${current_addr.mobile}${this.getDeliverFeeTimestamp}`
        this.$http({
          url: Config.dcHost + 'diancan/dada/query_deliver_fee',
          method: 'POST',
          params: {
            mchnt_id: this.mchnt_id,
            city_code: current_addr.city_code,
            third_order_id: this.third_order_id,
            cargo_price: this.cartData.price,
            is_prepay: 1,
            receiver_name: current_addr.contact_name,
            receiver_addr: `${current_addr.location} ${current_addr.detail_addr}`,
            receiver_phone: current_addr.mobile,
            receiver_lat: current_addr.latitude,
            receiver_lng: current_addr.longitude,
            format: 'cors'
          }
        }).then(function (res) {
          let data = res.data
          if (data.respcd === '0000') {
            let dadaDeliveryFee = data.data.fee
            this.deliveryStatus = `￥${(dadaDeliveryFee / 100).toFixed(2)}`
            this.delivery_no = data.data.deliveryNo
            if (this.dadaDeliveryFee === dadaDeliveryFee) {
              this.createOrder()
            }
            if (this.dadaDeliveryFee) {
              this.$messagebox({
                title: '',
                message: '配送费发生了变化，请重新下单',
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: '好的'
              })
            }
            this.dadaDeliveryFee = dadaDeliveryFee
          } else {
            this.deliveryStatus = '获取失败'
          }
        })
      },
      reviewOrder () {
        let now = new Date().getTime()
        if (!this.hasAddress) {
          this.$messagebox({
            title: '',
            message: '您还没有填配送地址哦～',
            showCancelButton: true,
            confirmButtonText: '填地址',
          })
          .then(action => {
            if (action === 'confirm') {
              this.goAddAddress()
            }
          })
          .catch(err => {
          })
        } else if (!this.current_addr.longitude) {
          this.$messagebox({
            title: '',
            message: '为了让商家能够精确的知道您在哪，请升级您的配送地址',
            showCancelButton: false,
            confirmButtonText: '升级地址',
          })
          .then(action => {
            if (action === 'confirm') {
              this.goUpdateAddress()
            }
          })
        } else if (this.current_addr.overdist) {
          this.$messagebox({
            title: '',
            message: '您的配送地址超出了商家配送范围，商家无法送餐',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: '好的'
          })
        } else if (this.isDadaDeliver && (now - this.getDeliverFeeTimestamp) >= 160 * 1000) {
          // 查询配送费后超时下单，需重新查询
          this.getDeliverFee()
        } else {
          this.createOrder()
        }
      },
      createOrder () {  // 创建订单
        /**
         * open_id
         * appid      // 商户appid
         * mchnt_id   // 商户id
         * note       // 备注
         * pay_way    // 支付方式: 'weixin'
         * pay_amt    // 付款金额
         * goods_info // 商品信息 json
         */

        // 达达配送需要多传参数
        let dada_args = {}
        if (this.isDadaDeliver) {
          dada_args.delivery_no = this.delivery_no
          dada_args.third_order_id = this.third_order_id
        }
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
          note: this.note,
          pay_way: 'weixin',
          pay_amt: this.payAmt,
          goods_info: JSON.stringify(goodsInfo),
          format: 'cors',
          sale_type: 3,
          addr_id: this.$parent.current_addr.addr_id
        }
        this.$http({
          url: Config.apiHost + 'diancan/c/makeorder',
          method: 'POST',
          params: Object.assign(args, dada_args)
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
          this.$toast(response.data.data.respmsg)
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
          params: args
        }).then((response) => {
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$toast(data.resperr)
            this.btnText = '确认下单'
            return
          }
          this.pay(data.pay_params)
          this.checkout = data
        }, (response) => {
          this.$toast(response.data.data.respmsg)
        })
      },
      pay (payParams) {
        if (!Util.isWX) {  // 不是微信中打开
          this.$toast('支付失败，请在微信中打开')
          this.btnText = '确认下单'
          return
        }
        let _this = this
        let onBridgeReady = () => {
          window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', payParams,
            function (res) {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                _this.orderPaySuccess()
              } else if (res.err_msg === 'getBrandWCPayRequest:fail_no permission to execute') {
                _this.$messagebox('无法唤起微信支付', '请关闭页面，重新下单即可正常使用。')
                _this.btnText = '支付失败';
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
      orderPaySuccess () {  // 订单支付成功
        store.commit('CLEANCARTS') // 清空购物车
        this.queryOrder()
      },
      orderPayFail () { // 支付失败
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
          params: args
        }).then((response) => {
          let data = response.data
          if (data.respcd === Config.code.OK) {
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
      },
      goAddAddress () {
        this.$router.push({
          path: '/address/add'
        })
      },
      goUpdateAddress () {
        this.$parent.tempAddr = this.$parent.current_addr
        this.$router.push({
          name: 'addressMarker'
        })
      },
      goList () {
        this.$router.push({
          path: '/address/list',
          query: {
            'mchnt_id': this.mchnt_id
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/base/_var";
  .create-order-view {
    font-size: 30px;
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
  .address {
    border-bottom: 2px dashed $orange;
    padding: 24px 30px;
    background:#fff url('../assets/arrow.svg') right 30px center no-repeat;
    &.add {
      min-height: 70px;
      display: flex;
      align-items: center;
      img {
        margin-right: 16px;
      }
      img, span {
        vertical-align: middle;
      }
    }
    &.content {
      line-height: 1.4;
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
      padding: 0;
      border: none;
      line-height: 1.5;
      resize: none;
    }
  }
  .goods {
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
      strong {
        display: block;
        font-weight: normal;
        line-height: 1.2;
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
    padding: 0 30px 30px;
    > span {
      display: block;
      font-size: 32px;
      &.except {
        text-decoration: line-through;
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
      display: block;
      flex: 1;
      text-align: right;
      i {
        width: 42px;
        height: 40px;
        margin-right: 16px;
        display: inline-block;
        vertical-align: middle;
        background: url('../assets/wechat.svg') no-repeat;
        background-size: 100% auto;
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
  .update-tip {
    color: #06B390;
    font-size: 24px;
  }
  .warn-tip {
    color: #E73B48;
    font-size: 24px;
    i {
      display: inline-block;
      width: 26px;
      height: 26px;
      margin-right: 8px;
      vertical-align: text-bottom;
      background: url("../assets/triangle.svg") center center no-repeat;
      background-size: contain;
    }
  }
</style>

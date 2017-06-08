<template>
  <div class="create-order-view">
    <section v-if="!hasAddress" class="address add" @click="goAddAddress">
      <img src="../assets/btn_add.svg"><span>新增送餐地址</span>
    </section>
    <section v-else class="address content" @click="goList" :id="current_addr.addr_id">
      <p>{{current_addr.contact_name}}　{{current_addr.mobile}}</p>
      <p>{{current_addr.location}} {{current_addr.detail_addr}}</p>
      <p v-if="!current_addr.longitude" class="update-tip">配送地址需要升级</p>
      <p v-if="current_addr.longitude && current_addr.overdist" class="warn-tip"><i></i>超出配送范围</p>
    </section>
    <section class="note item">
      <label for="note">备注：</label>
      <textarea v-model="note" id="note" placeholder="可填写口味要求或忌口等信息"></textarea>
    </section>
    <section class="goods item">
      <ul class="goods-list">
        <li v-for="goods in cart">
          <div>
            <strong>{{goods.name}}</strong>
            <em>{{goods.spec_list[goods._specIndex].name}}</em>
          </div>
          <span>￥{{goods.spec_list[goods._specIndex].txamt | formatCurrency}}<em>&nbsp;x&nbsp;{{goods.spec_list[goods._specIndex]._count}}</em></span>
        </li>
      </ul>
      <div class="deliver-fee">
        <em>配送费<span v-if="deliver.min_shipping_fee">（满{{deliver.min_shipping_fee | formatCurrency | noZeroCurrency}}元免配送费）</span></em>
        <span :class="{'except': cartData.price >= deliver.min_shipping_fee && deliver.min_shipping_fee}">￥{{deliver.shipping_fee | formatCurrency}}</span>
      </div>
      <div class="total">
        <!-- <del>原价¥63</del> -->
        <span>总计&nbsp;&nbsp;¥&nbsp;<em>{{cartData.price | formatCurrency}}</em></span>
      </div>
    </section>
    <section class="payment item">
      <em>支付方式</em>
      <span><i></i>微信支付</span>
    </section>
    <button class="done-btn" @click.stop="overdist" :disabled="btnText!=='确认下单'">
      <em>¥{{cartData.price | formatCurrency}}</em>&nbsp;{{btnText}}
    </button>
  </div>
</template>
<script>
  /* global _hmt */
  /* eslint-disable  */
  import Config from 'methods/Config'
  import Util from 'methods/Util'
  export default {
    props: ['cart', 'deliver'],
    data () {
      return {
        mchnt_id: '',       // 商户ID
        hasAddress: false,
        note: '',           // 备注
        orderId: '',        // 订单ID
        checkout: {},
        btnText: '确认下单'
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$messagebox && this.$messagebox.close()
      next()
    },
    created () {
      let params = this.$route.params
      this.mchnt_id = params.mchnt_id
      // let deliver = this.deliver
      // deliver.needFee = this.cartData.price < this.deliver.freeDeliverFee
      // this.$emit('updateDeliver', deliver)
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
        } else {
          this.$toast(data.respmsg)
        }
      })
    },
    computed: {
      cartData () {
        let count = 0
        let price = 0
        let cart = this.cart
        cart.forEach((goods, index) => {
          let spec = goods.spec_list[goods._specIndex]
          count += spec._count
          price += spec._count * spec.txamt
        })
        return {
          count,
          price
        }
      },
      payAmt () {
        let payAmt = this.cartData.price
        if (this.deliver.isFee && this.deliver.needFee) {
          payAmt += this.deliver.originFee
        }
        return payAmt
      },
      current_addr () {
        return this.$parent.current_addr
      }
    },
    methods: {
      overdist () {
        if (!this.current_addr.longitude) {
          this.$messagebox.confirm('为了让商家更好的为您提供配送服务，请升级您的配送地址。', '')
          .then((action) => {
            if (action === 'confirm') {
              this.createOrder()
            }
          })
        } else if (this.current_addr.overdist) {
          this.$messagebox({
            title: '',
            message: '这个地址太远啦，超过了商家的配送范围，可能会被商户拒单哦～',
            showCancelButton: true,
            confirmButtonText: '继续下单',
          })
          .then(action => {
            if (action === 'confirm') {
              this.createOrder()
            }
          })
          .catch(err => {
          })
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
        if (!this.$parent.current_addr.addr_id) {
          this.$dispatch('on-toast', '请添加配送地址!')
          return
        }
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
          open_id: this.$parent.user.open_id,
          appid: window.localStorage.getItem('dc_appid'),
          mchnt_id: this.mchnt_id,
          note: this.note,
          pay_way: 'weixin',
          pay_amt: this.payAmt,
          goods_info: JSON.stringify(goodsItem),
          format: 'cors',
          sale_type: 3,
          addr_id: this.$parent.current_addr.addr_id
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
          this.$dispatch('on-toast', '支付失败，请在微信中打开')
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
        this.$dispatch('on-cleanCart', this.mchnt_id)
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
      },
      goAddAddress () {
        this.$router.push({
          path: '/address/add'
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
    padding: 10px 30px;
    li {
      display: flex;
      line-height: 80px;
    }
    div {
      flex: 1;
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
    height: 90px;
    justify-content: space-between;
    padding: 0 30px;
    > span {
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

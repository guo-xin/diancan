<template>
  <div class="create-order-view">
    <section class="pay">
      <h2>支付方式</h2>
      <div class="text">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABgCAMAAADGkcf+AAAAnFBMVEUAAAB/1CF+1CF+0yF/1CF+1CF+1CGI9jZ/1CGB1iKB1iSC2CR+1CGA1COB1yON4DN/1CJ/1SF/1SKB1SOC2iaF3CmW/2p+1CF+1CF/1CKD5zF/1CKA1SF/1SKB1iR/1CF+1CF/1CF+1CGA1CJ/1CKA1SOC1yWB2SaA1CJ/1CJ/1SKA1SN/1CGA1CKA1CF/1CJ/1CJ/1CKA1SN+0yHQOtO8AAAAM3RSTlMA+Oj789fDBHo1LxzuRiUI66psPBYQAtC7iwrLoVwp5ODctpxXUCINl3FhTa+lkYWAZkHLcJMGAAADr0lEQVRo3qzV6W6yQACF4QPjMGxSUXAX99Yu6tee+7+3L5rGVpkBrPP8IhBCDiEvaCwPNv56OJHzWDid5cBbTf1toWBVP/ycLqkjZNpNYMd4u49ZabHb5niQ2nw4bECkbTwg+ueysaWf4W/CVPAuIk1wv+c97yfWEe6T7QT/xBnluMOswz+LN2gqWvEhadZwTosPct9RTx1owU6hRubRiuELKhVzWjKIUCF0aY0bwCiIaVErgEHQolVuYoiOS8sWETRySetkjhI1pH0fBUpGtM1ZFyjr0bL4mEHjZUGrFq+GMkxp02CmoBfQomEbRh5tEfsQ17bpr2Nr1TlEuJasyMvCvqQVrp/j2vjokPTw7Z02yM8n3NgseHKZZKMJ3ha3iuHlIs4SC6np4dbLSPAiwcmBj3F2CUo2c/7i42RuPzWhxyvyfPKh1HTHmp4dBG+EAHxqdRzWmmz6KJu5LDkCmFAnHucjVlt9Adq3puEBT9SSANoujcQ0hEa+MySjb+qpowBkK1NqRhF0Pjs0KPBGvR5Oug7L5n4OnWBCo5nxFz7CWVG6Wb4p6GRrVjhgRT1X4Uz5V6O8d2j1u3F1OzAxj/2W/HxHaQC93oDVPEgaTHDR/uiQQh6eoZdNWWcAlyYBfhsrGKjXFmvN4dBkj0a+JBtoVTxIRKgXpWxEwKXREXWU32IzHUgauU+o1pZsavm/N3vdbRQGogB8YGlKUsAstISQa3MhJTRbkvP+77aqWhV2m9iY4H5/EULC4zkjWzppHSCTv7K9MdbSp9eJyqKGVD4Mx7hmt6KWDSJK/MZlQUpNEWLWlBVeDzi6zsikL03w3XxJfU/AmBJeJo1qjeoGNpQ5SaJawx8APmXu0JCcPHbjA7gPKXNWh46aI6D8dzON9qnYJmfKWAHeZZXF7ny8S1bygomB/C2kknqhI8o5Dm8T4YNY0ihnj08FjXLrlm/ToKXAlxMNOqAhpTHTBA25Q0OsEWom66HAv5IBjUjxv8dnGmBfiOiFw5rRo++Svdvhoog9K4Af+ZKLqw7sUQSJ7a8eO4+U77EXXgmFhyl7MM6hJF54s2OGNlzeJpyjnaL/a1gD9wfPJVobszM7ukdricWOPDeDhgW7mR4EtGzZgTMbQlfFhlW529hUCDelgL5X1l72ADCs1iGvCNdunKCTOtPvYnzJt2/Hgc0Ge3Cs5gE6y/jJqr6XqngIRrHvx6PgUeBGQ35IFzCnDj97DtMmJK3JHsYVtGY5fkAyeoIBfwE2fBJDhMQqyAAAAABJRU5ErkJggg==">
        <span>微信支付</span>
        <i class="iconfont pay-type_select">&#xe603;</i>
      </div>
    </section>
    <ul class="goods-list">
      <li v-for="goods in cart">
        <div class="l-r">
          <div class="l_auto">
            <div class="name">{{goods.name}}</div>
            <div class="specname">{{goods.spec_list[goods._specIndex].name}}</div>
          </div>
          <div class="price"><em class="dollar">¥&nbsp;</em>{{goods.spec_list[goods._specIndex].txamt | formatCurrency}}<span>&nbsp;×&nbsp;{{goods.spec_list[goods._specIndex]._count}}</span>
          </div>
        </div>
      </li>
    </ul>
    <section class="info">
      <h2>补充信息</h2>
      <div class="l-r row">
        <span class="text">桌号</span>
        <!--<input class="num" :class="{'edit': isEditAddress}" :disabled="!isEditAddress" type="text" maxlength="8" v-model="address" placeholder="桌号"/>-->
        <!--开放编辑桌号-->
        <input class="l_auto num" :class="{'edit': isEditAddress}" type="text" maxlength="8" v-model="address" placeholder=""/>
      </div>
      <div class="l-r row">
        <span class="text">备注</span>
        <input class="l_auto remarks" type="text" v-model="note" maxlength="30" placeholder="可填写口味要求或忌口等信息"/>
      </div>
    </section>

    <div class="l-r-lr order-bar">
      <div class="price"><span>总价</span>&nbsp;<em class="dollar">¥</em>&nbsp;{{cartData.price | formatCurrency}}</div>
      <button class="btn" @click.stop="createOrder" :disabled="btnText!=='确认下单'">{{btnText}}</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  /* eslint-disable */
  import Config from '../methods/Config'
  import { isWX } from '../methods/Util'

  export default {
    components: {},
    data () {
      return {
        visible: false,
        mchnt_id: '',       // 商户ID
        address: '',        // 桌号
        isEditAddress: '',  // 是否可以编辑桌号
        note: '',           // 备注
        orderId: '',        // 订单ID
        checkout: {},
        btnText: '确认下单'
      }
    },
    route: {
      activate (transition) {
        // let params = transition.from.params || {}
        let params = this.$route.params
        this.mchnt_id = params.mchnt_id
        this.address = params.address && params.address !== ':address' ? decodeURIComponent(params.address) : ''
        this.isEditAddress = !this.address

        if (this.cart.length) {
          transition.next()
          return
        }
        if (this.mchnt_id) {
          this.$router.replace({
            name: 'merchant',
            params: {
              'mchnt_id': this.mchnt_id,
              'address': encodeURIComponent(this.address)
            }
          })
          return
        }
        transition.abort()
      }
    },
    computed: {
      cart () {
        this.$dispatch('on-getCart', this.mchnt_id)
        return this.$root.cart || []
      },
      cartData () {
        let count = 0
        let price = 0
        let cart = this.$root.cart
        cart.forEach((goods, index) => {
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
//        let args = this.$route.params
//        if (!(this.address = ('' + this.address).trim())) {
//          this.$dispatch('on-toast', '请输入桌号！')
//          return false
//        }
        this.btnText = '下单中'
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
          // success callback
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$dispatch('on-toast', data.respmsg)
            // transition.abort()
            this.btnText = '确认下单'
            return
          }
          let orderId = data.data.out_trade_no
          this.orderId = orderId
//          this.$dispatch('on-toast', '订单创建成功：' + orderId)
          this.getPayArgs(data.data)
          this.btnText = '下单成功'
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
          // success callback
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$dispatch('on-toast', data.resperr)
            // transition.abort()
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
        this.btnText = '支付中'
        if (!isWX) {  // 不是微信中打开
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
                alert('无法唤起微信支付！请关闭页面，重新下单，即可正常使用');
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
          data: args
        }).then((response) => {
          // success callback
          this.$router.replace({
            name: 'orderDetail',
            params: {
              'order_id': this.orderId,
              'mchnt_id': this.mchnt_id
            }
          })
        }, (response) => {
          // error callback
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

<style scoped lang="scss" rel="stylesheet/scss">
  .create-order-view {
    padding-bottom: 300px;
  }

  .edit {
    color: #2F323A !important;
    border-color: #FE9B20 !important;
  }

  .text {
    font-size: 34px;
    color: #2f323a;
    line-height: 34px;
  }

  section {
    padding: 30px;
    h2 {
      font-size: 30px;
      color: #8a8c92;
    }
  }

  section.pay {
    /*position: relative;*/
    background: #E5E5E5;
    /*height: 160px;*/
    .text {
      position: relative;
      display: flex;
      align-items: center;
      margin-top: 28px;
      img {
        width: 52px;
        height: 48px;
        margin-right: 20px;
      }
    }
    .pay-type_select {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);

      font-size: 50px;
      color: #0076FF;
    }
  }

  .goods-list {
    padding: 30px;
    padding-right: 0;

    li {
      padding: 30px;
      padding-left: 0;
      border-bottom: 2px solid #e5e5e5; /*px*/
      >div{
        align-items: center;
      }
    }
    .name {
      margin-right: 5px;
      font-size: 30px;
      line-height: 30px;
      color: #2f323a;
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
      color: #fe9b20;
      line-height: 34px;
      span {
        /*font-size: 34px;*/
        font-size: 75%;
        color: #8A8C92;
      }
    }
  }

  .row {
    margin-top: 30px;
    align-items: center;
    > *:first-child {
      width: 128px;
    }
  }

  /*编号*/
  .num {
    padding: 0 10px;
    /*width: 124px;*/
    /*width: 350px;*/
    /*width: 590px;*/
    height: 68px;
    border: 2px solid #E5E5E5; /*px*/
    /*border: 2px solid #fe9b20; !*px*!*/
    border-radius: 6px;
    /*text-align: center;*/
    font-size: 30px;
    /*color: #8A8C92;*/
  }

  /*备注*/
  .remarks {
    padding: 0 10px;
    border: 2px solid #E5E5E5; /*px*/
    border-radius: 6px;
    /*width: 590px;*/
    height: 68px;
    font-size: 30px;
  }

  .order-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-left: 30px;
    padding-right: 12px;

    background: #e5e5e5;
    height: 104px;
    align-items: center;

    span {
      font-size: 26px;
      color: #2f323a;
    }
    .price {
      font-size: 40px;
      color: #2f323a;
      line-height: 40px;
    }
    button {
      background: #fe9b20;
      border-radius: 6px;
      width: 260px;
      height: 80px;
      font-size: 40px;
      color: #fff;
    }
  }

  .info {
    /*margin-bottom: 300px;*/
  }
</style>

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
    <section class="info">
      <div class="address">
        <div v-if="!hasAddress" class="empty-address" @click.prevent="goAddAddress">
          <img src="../assets/btn_add.svg" alt="" class="address-add">新增配送地址
          <img src="../assets/btn_arrow.svg" alt="" class="address-arrow">
        </div>
        <div v-else class="address-content">
          <a @click.prevent="goList">
            <ul id="{{current_addr.addr_id}}">
              <li>{{current_addr.contact_name}} {{current_addr.mobile}}</li>
              <li>{{current_addr.parent_area[0].name}} {{current_addr.parent_area[1].name}} {{current_addr.parent_area[2].name}}</li>
              <li>{{current_addr.detail_addr}}</li>
            </ul>
            <img src="../assets/btn_arrow_orange.svg" alt="">
          </a>
        </div>
      </div>
      <div class="l-r row info-remark">
        <span class="text">备注</span>
        <input class="l_auto remarks" type="text" v-model="note" maxlength="30" placeholder="可填写您的其他要求"/>
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
    <div class="extra-info" v-if="deliver.isFee">
      <h4>补充信息</h4>
      <p>配送费（满{{deliver.freeDeliverFee | formatCurrency | noZeroCurrency}}免配送费） <span :class="{'free': cartData.price >= deliver.freeDeliverFee}">￥<i>{{deliver.originFee | formatCurrency}}</i></span></p>
    </div>
    <div class="l-r-lr order-bar">
      <div class="price"><span>总价</span>&nbsp;<em class="dollar">¥</em>&nbsp;{{payAmt | formatCurrency}}</div>
      <button class="btn" @click.stop="createOrder" :disabled="btnText!=='确认下单'">{{btnText}}</button>
    </div>
    <alert alert-title="温馨提示" :alert-tip="alertTip" :alert-visible.sync="alertVisible"></alert>
  </div>
</template>

<script>
  /* global _hmt */
  /* eslint-disable  */
  import Config from '../../../methods/Config'
  import Util from '../../../methods/Util'
  import alert from '../../../../components/alert/alert.vue'

  export default {
    components: {
      alert
    },
    data () {
      return {
        alertVisible: false,
        alertTip: '',
        mchnt_id: '',       // 商户ID
        hasAddress: false,
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
        this.$watch('$root.cart', function (val) {
          this.deliver.needFee = this.cartData.price < this.deliver.freeDeliverFee
        })
        if (this.cart.length) {
          this.$http({
            url: Config.dcHost + 'diancan/c/get_addr',
            method: 'JSONP',
            data: {
              format: 'jsonp'
            }
          }).then(function (res) {
            if (res.data.respcd === '0000') {
              let _data = res.data.data.addr
              if (Util.isEmptyObject(_data)) {
                this.$root.current_addr = {}
                return
              }
              this.hasAddress = true
              this.$root.current_addr = _data
            }
          })
          transition.next()
          return
        }
        if (this.mchnt_id) {
          this.$router.replace({
            name: 'merchant',
            params: {
              'mchnt_id': this.mchnt_id
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
      },
      payAmt () {
        let payAmt = this.cartData.price
        if (this.deliver.isFee && this.deliver.needFee) {
          payAmt += this.deliver.originFee
        }
        return payAmt
      },
      deliver () {
        return this.$root.deliver
      },
      current_addr () {
        return this.$root.current_addr
      }
    },
    methods: {
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
        if (!this.$root.current_addr.addr_id) {
          this.$dispatch('on-toast', '请添加配送地址!')
          return
        }
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
          note: this.note,
          pay_way: 'weixin',
          pay_amt: this.payAmt,
          goods_info: JSON.stringify(goodsItem),
          format: 'cors',
          sale_type: 3,
          addr_id: this.$root.current_addr.addr_id
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
//              window.alert(JSON.stringify(res))
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                _this.orderPaySuccess()
              } else if (res.err_msg === 'getBrandWCPayRequest:fail_no permission to execute') {
                _this.alertTip = '无法唤起微信支付!请关闭页面，重新下单，即可正常使用。';
                _this.alertVisible = true;
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
      },
      goAddAddress () {
        this.$router.go({
          path: '/address/add'
        })
      },
      goList () {
        this.$router.go({
          path: '/address/list'
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../scss/mixins";
  .create-order-view {
    background-color: #f7f7f7;
    padding-bottom: 104px;
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
    background: #F7F7F7;
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
      color: #8DDE34;
    }
  }

  .goods-list {
    padding-left: 30px;
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

    background: #fff;
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
    background-color: #ffffff;
    padding: 0;
    @include empty-address;
    .address-content {
      padding: 0 34px;
      border-bottom: 2px dashed #FE9B20;
      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        ul {
          flex: 1;
          li {
            line-height: 1.4;
            &:nth-of-type(1) {
              color: #606470;
              font-size: 28px;
              margin: 16px auto 6px;
            }
            &:nth-of-type(2) {
              color: #8A8C92;
              font-size: 26px;
              margin-bottom: 6px;
            }
            &:nth-of-type(3) {
              color: #2F323A;
              font-size: 30px;
              margin-bottom: 20px;
            }
          }
        }
        img {
          display: block;
          width: 16px;
          height: 32px;
        }
      }
    }
  }
  .info-remark {
    padding: 0 30px 20px;
    .text {
      width: auto;
      margin-right: 30px;
    }
  }
  .extra-info {
    padding-left: 30px;
    h4 {
      font-size: 30px;
      color: #8A8C92;
      margin-top: 44px;
    }
    p {
      padding: 28px 30px 28px 0;
      font-size: 30px;
      color: #2F323A;
      border-bottom: 2px solid #e5e5e5;
      span {
        float: right;
        font-size: 26px;
        color: #FE9B20;
        &.free {
          color: #8A8C92;
          i {
            text-decoration: line-through;
          }
        }
        i {
          font-size: 34px;
          font-style: normal;
          text-decoration: none;
        }
      }
    }
  }
</style>

<template>
  <div class="order-detail-view">
    <section class="order_sn">
      <h3><img src="../assets/icon-check.png" alt="">支付成功</h3>
      <div class="order_sn_num"><span>取餐号</span><em>{{order.orderinfo.order_sn}}</em></div>
      <p class="order_address" v-show="order.orderinfo.address">
        <span>{{order.orderinfo.address}}号桌</span>
      </p>
    </section>
    <section class="show_detail" :class="{'activate': hasDetail}" @click="hasDetail=!hasDetail">
      {{hasDetail ? '关闭订单详情' : '查看订单详情'}}<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAQBAMAAADzFNLhAAAAJ1BMVEUAAACLjZOLjJOLjZOLjZSNjZWLoqKKjpSLkJSLjZONjZSMj5OKjJIHsrhbAAAADHRSTlMA5dCuWR0LhTeETEldKZHPAAAAb0lEQVQI12NAB9yCDnA2i+AGBsYzx+H8mjMCQP4ZMyg3+QyQz3XmzKEAMJdV58yZBQwMjWfOSAB5EAZU2AFkGEghVNtJIDUHblANkAUUhVgEVRkK1QUzSRBqKswmqGFwl8ANgxoJMwxmpJIDA1YAADiDMgJvsIRuAAAAAElFTkSuQmCC">
    </section>
    <div v-show="hasDetail">
      <section class="order-content">
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
        <div class="total">
          <strong>总计</strong>
          <span><sub>￥</sub>{{order.orderinfo.txamt | formatCurrency}}</span>
        </div>
        <div v-if="order.orderinfo.note" class="note-item">
          <p><em>备注：</em>{{order.orderinfo.note}}</p>
        </div>
      </section>
      <section class="order-info">
        <ul>
          <li>订单编号：{{order.orderinfo.order_id}}</li>
          <li>购买时间：{{order.orderinfo.pay_time | formatTime('yyyy-MM-dd hh:mm')}}</li>
          <li>支付方式：{{order.orderinfo.pay_type === '800207' ? '微信支付' : '余额支付'}}</li>
        </ul>
      </section>
    </div>
    <loading :visible="isLoading"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import util from 'methods/Util'
  import loading from '../components/loading/Loading'
  import config from 'methods/Config'

  export default {
    components: {
      loading
    },
    data () {
      return {
        isLoading: false,
        order: {
          orderinfo: ''
        },
        hasDetail: false
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        /**
         * order_id     // 订单id
         * mchnt_id     // 商户id
         */
        this.isLoading = true
        let args = this.$route.params
        args.format = 'jsonp'
        this.$http({
          url: `${config.apiHost}diancan/c/order_detail`,
          method: 'JSONP',
          params: args
        }).then(function (response) {
          this.isLoading = false
          let data = response.data
          if (data.respcd === config.code.OK) {
            this.hasDetail = data.data.goods_list
            this.order = data.data
            const shopname = data.data.merchant_info.shop_name
            util.setTitle(shopname)
          } else {
            this.$toast(data.respmsg)
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/base/_layout";
  @import "../styles/base/_var";

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
  .order-content {
    padding: 30px;
  }

  .order-detail-view {
    background-color: #F7F7F7;
    padding-top: 64px;
    padding-bottom: 64px;
    font-size: 30px;
  }

  .order_sn {
    margin:0 30px 40px;
    padding-bottom: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    h3 {
      position: relative;
      padding-top: 0.9rem;
      img {
        width: 96px;
        height: 96px;
        display: block;
        margin-bottom: 20px;
        position: absolute;
        left: 50%;
        top: -48px;
        margin-left: -48px;
      }
      font-weight: normal;
      color: #7ED321;
      font-size: 36px;
    }
    .order_sn_num {
      padding: 40px 0;
      span, em {
        vertical-align: baseline;
      }
      span {
        margin-right: 30px;
        font-size: 36px;
        color: #8A8C92;
        vertical-align: 10%;
      }
      em {
        font-size: 80px;
      }
    }
    .order_address {
      margin: 0 36px;
      color: #8A8C92;
      background: url('../assets/line--.svg') repeat-x center center;
      span {
        background-color: #fff;
        padding: 0 30px;
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
    li {
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
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
      color: $aluminium;
      em {
        font-size: 26px;
      }
    }
  }
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    color: #2F323A;
    strong, span {
      display: block;
    }
    strong {
      font-weight: normal;
      font-size: 34px;
    }
    span {
      font-size: 40px;
    }
    text-align: right;
  }
  .note-item {
    margin-top: 36px;
    background-color: #EFEEED;
    padding: 24px 20px;
    color: $aluminium;
    em {
      color: $lightBlack;
    }
  }

  .order-info {
    padding: 0 30px;
    font-size: 26px;
    color: #8A8C92;
    background-color: transparent;
    ul {
      padding-top: 24px;
      border-top: 2px solid #E5E5E5;
    }
    li {
      line-height: 1.6;
    }
  }
</style>

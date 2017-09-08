<template>
  <div class="order-detail-view">
    <section class="shop">
      <div class="l-r">
        <h2 class="l_auto shopname">{{order.orderinfo.shop_name}}</h2>
        <div class="num" v-show="order.orderinfo.address">{{order.orderinfo.address}}号桌</div>
      </div>
    </section>
    <section class="order_sn">
      <div class="l-c-c order_sn_num"><span>取餐号</span>{{order.orderinfo.order_sn}}</div>
      <p class="order_sn_text">请留意餐厅叫号，及时取餐哦～</p>
    </section>
    <section class="show_detail" :class="{'activate': hasDetail}" @click="hasDetail=!hasDetail">查看订单详情<img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAQBAMAAADzFNLhAAAAJ1BMVEUAAACLjZOLjJOLjZOLjZSNjZWLoqKKjpSLkJSLjZONjZSMj5OKjJIHsrhbAAAADHRSTlMA5dCuWR0LhTeETEldKZHPAAAAb0lEQVQI12NAB9yCDnA2i+AGBsYzx+H8mjMCQP4ZMyg3+QyQz3XmzKEAMJdV58yZBQwMjWfOSAB5EAZU2AFkGEghVNtJIDUHblANkAUUhVgEVRkK1QUzSRBqKswmqGFwl8ANgxoJMwxmpJIDA1YAADiDMgJvsIRuAAAAAElFTkSuQmCC"></section>
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
        </ul>
      </section>
    </div>
    <loading :visible="isLoading"></loading>
    <red-packet v-show="false"></red-packet>
  </div>
</template>

<script type="text/ecmascript-6">
  import util from 'methods/Util'
  import loading from '../components/loading/Loading'
  import RedPacket from '../components/RedPacket'
  import config from 'methods/Config'

  export default {
    components: {
      loading, RedPacket
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
            const shopname = data.data.orderinfo.shop_name
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
  section {
    padding: 30px;
  }

  .order-detail-view {
    background-color: #F7F7F7;
    font-size: 30px;
  }

  .shop {
    .shopname {
      font-size: 34px;
      color: #2F323A;
    }
    .num {
      font-size: 30px;
      color: #8A8C92;
    }
  }

  .order_sn {
    margin: 30px;
    margin-top: 10px;
    margin-bottom: 20px;
    padding-top: 0;
    background: #fff;
    border: 2px solid #FE9B20; /*px*/
    border-radius: 8px;
    text-align: center;
    font-size: 30px;
    h3 {
      font-weight: normal;
      line-height: 56px;
      color: #9B9DA3;
    }
    p {
      color: #2F323A;
    }
    .order_sn_num {
      height: 188px;
      font-size: 80px;
      line-height: 56px;
      span {
        margin-right: 30px;
        font-size: 36px;
        color: #8A8C92;
      }
    }
    .order_sn_text {
      /*margin-top: 20px;*/
      padding-top: 30px;
      border-top: 2px solid #FFDCB1; /*px*/
      color: #FE9B20;
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
    border-top: 2px solid #E5E5E5;
    padding-top: 10px;
    strong, span {
      display: block;
    }
    strong {
      font-weight: normal;
    }
    span {
      font-size: 40px;
      color: #FE9B20;
      sub {
        color: $aluminium;
      }
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

  .order-info {
    font-size: 26px;
    color: #8A8C92;
    background-color: transparent;
  }
</style>

<template>
  <div :class="{'hasbottom': fromName === 'merchant'}">
    <div v-if="noData" class="no-data">
      <img src="./assets/no_data.png" alt="">
      <p>暂无订单</p>
    </div>
    <ul class="order-list" v-else>
      <li v-for="item in orders" @click='jumpUrl(item)'>
        <div v-if="item.order_type === 3" :class="theme(item.delivery_state)">
          <h2 v-if="item.shop_name">{{item.shop_name}} <span>外卖</span></h2>
          <div class="content">
            <p>外送单号 <em>{{item.order_sn}}</em>
              <i v-if="item.delivery_state === 4">已退款</i>
              <i v-if="item.delivery_state === 3">已送达</i>
              <i v-if="item.delivery_state === 2">已发货</i>
              <i v-if="item.delivery_state === 1">已接单</i>
              <i v-if="item.delivery_state === 0">已付款</i>
            </p>
            <div>
              <p class="goods-name">{{item.ordername}} <span>￥{{item.txamt | formatCurrency}}</span>
              </p>
              <p class="goods-time">购买时间: {{item.pay_time | formatTime('yyyy-M-d hh:mm')}}
                <span v-if="item.order_state === 3">已退款</span>
                <span v-if="item.order_state === 2" class="success">支付成功</span>
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <h2 v-if="item.shop_name">{{item.shop_name}} <span>{{$t.eatin}}</span></h2>
          <div class="content">
            <p>{{$t.number}} <em>{{item.order_sn}}</em> <span v-if="item.address">{{item.address}}</span></p>
            <div>
              <p class="goods-name">{{item.ordername}} <span>￥{{item.txamt | formatCurrency}}</span></p>
              <p class="goods-time">购买时间: {{item.pay_time | formatTime('yyyy-M-d hh:mm')}}
                <span v-if="item.order_state === 3">已退款</span>
                <span v-if="item.order_state === 2" class="success">支付成功</span>
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="more-btn" v-if="fromName === 'orderlist'" v-show='loaded'>
      <p>没有更多了</p>
    </div>
    <div class="more-btn" v-if="fromName === 'merchant'" @click="emitGoOrderList()">
      <p>查看更多</p>
    </div>
    <loading :visible="loading"></loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import Config from 'methods/Config'
  import loading from 'components/loading/juhua.vue'

  export default {
    data () {
      return {
        init: true,
        userId: this.$route.params.mchnt_id || '',
        groupId: this.$route.params.group_id || '',
        openId: sessionStorage.getItem('dc_openid') || '',
        firstRequest: true,
        loading: false,
        loaded: false,
        page: 1,
        orders: [],
        noData: false,
        fromName: 'merchant'
      }
    },
    components: {
      loading: loading
    },
    created () {
      let fromName = window.location.pathname.indexOf('order-list') > 0 ? 'orderlist' : 'merchant'
      this.fromName = fromName
      if (fromName === 'orderlist') {
        this.getData()
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.fromName = from.name === 'merchant' ? 'merchant' : 'orderlist'
      })
    },
    mounted () {
      if (this.fromName === 'orderlist') {
        let _this = this
        window.onscroll = () => {
          var scrollHeight = document.body.scrollHeight
          var windowScrollTop = window.scrollY
          var innerHeight = window.innerHeight
          if (windowScrollTop + innerHeight >= scrollHeight && !_this.loading) {
            _this.getData()
          }
        }
      }
    },
    methods: {
      emitGoOrderList () {
        this.$emit('goOrderList')
      },
      getDataForMerchant () {
        let _this = this
        this.$http({
          method: 'JSONP',
          url: Config.apiHost + 'diancan/c/order_list',
          params: {
            format: 'jsonp',
            openid: this.openId,
            mchnt_id: this.userId,
            page_size: 10,
            page: 1
          }
        }).then(function (response) {
          let res = response.data
          _this.loading = false
          if (res.respcd === '0000') {
            _this.orders = _this.orders.concat(res.data.order_list)
            if (_this.orders === 0) {
              _this.noData = true
            }
            _this.loaded = true
            _this.$emit('updateOrdersLoaded')
          } else {
            _this.$toast(res.respmsg)
          }
        })
      },
      requestData () {
        let data = {
          format: 'jsonp',
          openid: this.openId,
          page_size: 10,
          page: this.page
        }
        if (this.groupId) {
          data.groupid = this.groupId
        }
        if (this.userId) {
          data.mchnt_id = this.userId
        }
        return data
      },
      getData () {
        console.log('getData')
        let _this = this
        if (!this.loaded) {
          this.loading = true
          if (!this.firstRequest) {
            this.page += 1
          }
          this.$http({
            method: 'JSONP',
            url: Config.apiHost + 'diancan/c/order_list',
            params: _this.requestData()
          }).then(function (response) {
            let res = response.data
            _this.init = false
            _this.firstRequest = false
            _this.loading = false
            if (res.respcd === '0000') {
              _this.orders = _this.orders.concat(res.data.order_list)
              if (_this.orders === 0) {
                _this.noData = true
              }
              if (res.data.order_list.length < 10) {
                _this.loaded = true
              }
            } else {
              _this.$toast(res.respmsg)
            }
          })
        }
      },
      jumpUrl (item) {
        window.localStorage.removeItem('orderDetailFromName')
        let path = Config.env === 'development' ? '' : 'dc/'
        let type = item.order_type === 3 ? 'take-out' : 'index'
        window.location.href = `${window.location.origin}/${path}${type}.html#/order_detail/${item.order_id}/${item.mchnt_id}`
      },
      theme (id) {
        switch (id) {
        // 0 橘色 1 红色 2 蓝色 3 绿色
          case 0: return 'border0'
          case 1: return 'border1'
          case 2: return 'border2'
          case 3: return 'border3'
        }
      }
    }
  }
</script>
<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../styles/base/_reset";
  .no-data{
    position: relative;
    width: 100%;
    height: 100%;
    img{
      display: block;
      width: 500px;
      height: 600px;
      margin: 250px auto 0 auto;
    }
    p{
      text-align: center;
      font-size: 30px;
      line-height: 3;
    }
  }
  .hasbottom {
    padding-bottom: 180px;
  }
  .order-list {
    li {
      &:first-child > div {
        border-top: none;
      }
      > div {
        border-top: 2px solid #e5e5e5;
        border-bottom: 2px solid #e5e5e5;
      }
    }
  }
  .border0 {
    border-top: 2px solid #FE9B20;
    border-bottom: 2px solid #FE9B20;
    p > i {
      color: #FE9B20;
    }
  }
  .border1 {
    border-top: 2px solid #FD5359;
    border-bottom: 2px solid #FD5359;
    p > i {
      color: #FD5359;
    }
  }
  .border2 {
    border-top: 2px solid #4A90E2;
    border-bottom: 2px solid #4A90E2;
    p > i {
      color: #4A90E2;
    }
  }
  .border3 {
    border-top: 2px solid #60AA0F;
    border-bottom: 2px solid #60AA0F;
    p > i {
      color: #60AA0F;
    }
  }
  .order-list {
    list-style: none;
    margin: 0;
    li {
      margin-bottom: 24px;
      background-color: #fff;
      h2 {
        height: 70px;
        line-height: 70px;
        padding: 0 30px;
        font-size: 30px;
        color: #2F323A;
        margin: 0 auto;
        span {
          color: #8A8C92;
          float: right;
        }
      }
      .content {
        border-top: 2px solid #E5E5E5;
        > p {
          margin: 0 30px;
          height: 108px;
          line-height: 108px;
          font-size: 34px;
          color: #8A8C92;
          border-bottom: 2px solid #E5E5E5;
          em {
            font-style: normal;
            color: #FE9B20;
          }
          span {
            float: right;
            color: #8A8C92;
          }
          i {
            font-style: normal;
            float: right;
            font-size: 34px;
          }
        }
        > div {
          margin: 0 30px;
          padding-bottom: 30px;
          .goods-name {
            font-size: 34px;
            color: #2F323A;
            margin: 0;
            padding: 30px 0 24px;
            span {
              float: right;
              font-size: 30px;
              color: #8A8C92;
            }
          }
          .goods-time {
            font-size: 26px;
            color: #8A8C92;
            margin: 0;
            span {
              float: right;
              position: relative;
              &.success {
                &:before {
                  content: '';
                  position: absolute;
                  display: block;
                  left: -16px;
                  top: 8px;
                  width: 12px;
                  height: 12px;
                  border-radius: 12px;
                  background-color: #7ED321;
                }
              }
            }
          }
        }
      }
    }
  }
  .more-btn {
    border-top: 2px solid #E5E5E5;
    border-bottom: 2px solid #E5E5E5;
    color: #8A8C92;
    font-size: 24px;
    background-color: #fff;
    text-align: center;
    padding: 24px 0;
    p {
      margin: 0;
    }
  }
</style>

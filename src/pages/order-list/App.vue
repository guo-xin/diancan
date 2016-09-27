<template>
  <ul v-if="!noData">
    <li v-for="item in responseData.list" @click='jumpUrl(item.url)'>
      <h2 v-if="item.shop_name">{{item.shop_name}} <span>堂食</span></h2>
      <div class="content">
        <p>取餐号 <em>{{item.order_sn}}</em> <span v-if="item.address">{{item.address}}号桌</span></p>
        <div>
          <p class="goods-name">{{item.ordername}} <span>￥{{item.txamt | formatCurrency}}</span></p>
          <p class="goods-time">购买时间: {{item.pay_time | formatTime 'yyyy-M-d hh:mm'}} <span></span></p>
        </div>
      </div>
    </li>
  </ul>
  <div v-if="noData" class="no-data">
    <img src="assets/no_data.png" alt="">
    <p>暂无数据</p>
  </div>
  <loading :visible="loading"></loading>
  <Toast :msg.sync="errMsg"></Toast>
</template>
<style lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../styles/main.scss";

  html {
    height: 100%;
  }

  body{
    background: #F7F7F7;
    height: 100%;
  }
  .no-data{
    position: relative;
    padding: 1px;
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
    }
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin: 20px auto;
      background-color: #fff;
      h2 {
        height: 70px;
        line-height: 70px;
        padding: 0 30px;
        font-size: 30px;
        color: #2F323A;
        border-top: 2px solid #E5E5E5;
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
          }
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  /*eslint-disable no-unused-vars*/
  import Config from '../../methods/Config'
  import Util from '../../methods/Util'
  import loading from '../../components/loading/juhua.vue'
  import Toast from '../../components/tips/Toast.vue'

  export default {
    data () {
      return {
        init: true,
        mId: Util.getRequestParams().mchnt_id || '',
        openId: window.localStorage.getItem('dc_openid') || '',
        firstRequest: true,
        loading: false,
        loaded: false,
        errMsg: '',
        responseData: {
          list: []
        },
        noData: false
      }
    },
    computed: {
      requestData () {
        return {
          format: 'jsonp',
          mchnt_id: this.mId,
          openid: this.openId,
          page_size: 10,
          page: 1
        }
      }
    },
    components: {
      loading: loading,
      Toast: Toast
    },
    created () {
      this.getData()
    },
    ready () {
      let _this = this
      window.onscroll = () => {
        var scrollTop = document.body.scrollTop
        var windowHeight = document.body.offsetHeight
        var scrollHeight = document.body.scrollHeight
        if (scrollTop + windowHeight + 100 >= scrollHeight && !_this.loading) {
          _this.getData()
        }
      }
    },
    methods: {
      getData () {
        let _this = this
        if (!this.loaded) {
          this.loading = true
          if (!this.firstRequest) {
            this.requestData.page += 1
          }
          this.$http({
            url: Config.apiHost + 'diancan/c/order_list',
//            url: 'http://172.100.111.215:9300/diancan/c/order_list',
            data: _this.requestData,
            method: 'JSONP'
          }).then(function (response) {
            let res = response.data
            _this.init = false
            _this.firstRequest = false
            _this.loading = false
            if (res.respcd === '0000') {
              res.data.order_list.map(function (item) {
                item.url = `${Config.apiHost}dc/?/#!/order_detail/${item.order_id}/${item.mchnt_id}`
              })
              _this.responseData.list = _this.responseData.list.concat(res.data.order_list)
              if (res.data.order_list.length === 0) {
                _this.noData = true
              }
              if (res.data.order_list.length < 10) {
                _this.loaded = true
              }
            } else {
              _this.errMsg = res.resperr
              console.log(_this.errMsg)
            }
          })
        }
      },
      jumpUrl (url) {
        console.log(url)
        window.location.href = url
      }
    }
  }
</script>

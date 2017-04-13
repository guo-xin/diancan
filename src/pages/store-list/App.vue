<template>
  <get-Location v-ref:location></get-Location>
  <ul>
    <li>
      <figure>
        <img src="https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=338225533,1006586043&fm=80&w=179&h=119&img.PNG" alt="">
        <time>9:00-22:00营业</time>
      </figure>
      <div>
        <h3>汤城小厨（凯德茂望京店）</h3>
        <p class="address">北京市 朝阳区 望京SOHO 中心广场负一层1012中心广场负一层1012</p>
        <p class="distance"><i></i>50m</p>
        <footer>
          <p>起送¥20；配送¥5<br>满50元免费送费</p>
          <a href="tel:13161009030"><i></i></a>
        </footer>
      </div>
      <span class="ribbon">离我最近</span>
    </li>
    <li>
      <figure>
        <img src="https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=338225533,1006586043&fm=80&w=179&h=119&img.PNG" alt="">
        <time>9:00-22:00营业</time>
      </figure>
      <div>
        <h3>汤城小厨（凯德茂望京店）</h3>
        <p class="address">北京市 朝阳区 望京SOHO 中心广场负一层1012中心广场负一层1012</p>
        <p class="distance"><i></i>50m</p>
        <footer>
          <p>起送¥20；配送¥5<br>满50元免费送费</p>
          <a href="tel:13161009030"><i></i></a>
        </footer>
      </div>
      <span class="ribbon">上次去过</span>
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

  body {
    background: #F7F7F7;
    height: 100%;
  }
  ul, h3, p, figure {
    margin: 0;
  }

  .no-data {
    position: relative;
    padding: 1px;
    width: 100%;
    height: 100%;
    img {
      display: block;
      width: 500px;
      height: 600px;
      margin: 250px auto 0 auto;
    }
    p {
      text-align: center;
      font-size: 30px;
    }
  }
  .icon {
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .icon-marker {
    background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxM3B4IiB2aWV3Qm94PSIwIDAgMTAgMTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzICgzODk5OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl/lnLDlnYA8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5pyq6I635Y+W5Yiw5Zyw55CG5L2N572uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTUuMDAwMDAwLCAtNzkuMDAwMDAwKSIgZmlsbD0iIzAwMDAwMCI+CiAgICAgICAgICAgIDxnIGlkPSLlnLDlnYAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA2NC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOCwxOS45OTk5MTg1IEMxOCwxOC44OTUwMjYzIDE4Ljg5NTY0MTUsMTggMjAsMTggQzIxLjEwNDM1ODUsMTggMjIsMTguODk1MDI2MyAyMiwxOS45OTk5MTg1IEMyMiwyMS4xMDQ0ODQ5IDIxLjEwNDM1ODUsMjIgMjAsMjIgQzE4Ljg5NTY0MTUsMjIgMTgsMjEuMTA0NDg0OSAxOCwxOS45OTk5MTg1IE0yNSwyMC4wNjQ2NjQgQzI1LDE3LjI2NzM0MjQgMjIuNzYxMTk0LDE1IDE5Ljk5OTc4NTMsMTUgQzE3LjIzODgwNiwxNSAxNSwxNy4yNjczNDI0IDE1LDIwLjA2NDY2NCBDMTUsMjIuODYyMTMwNSAxOS4xMTU4NTQxLDI4IDE5Ljk5OTc4NTMsMjggQzIwLjczNjMyMzIsMjggMjUsMjIuODYyMTMwNSAyNSwyMC4wNjQ2NjQgWiIgaWQ9Imljb25f5Zyw5Z2AIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==");
    @extend .icon;
  }
  .icon-phone {
    background-image: url("data:image/png;base64,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");
    @extend .icon;
  }
  ul {
    list-style: none;
    padding-left: 0;
    li {
      display: inline-flex;
      position: relative;
      overflow: hidden;
      border-bottom: 2px solid $lightGray;
      padding: 30px 26px 0 30px;
      font-size: 24px;
      figure {
        width: 200px;
        img {
          width: 100%;
        }
        time {
          display: block;
          font-size: 18px;
          text-align: center;
          color: $aluminium;
        }
      }
      div {
        padding-left: 20px;
        h3 {
          margin-bottom: 10px;
          font-size: 30px;
        }
      }
      .address {
        color: $aluminium;
        line-height: 1.5;
        margin-bottom: 10px;
      }
      .distance {
        font-size: 28px;
        font-weight: bold;
        color: $black;
        margin-bottom: 20px;
        i {
          width: 22px;
          height: 22px;
          @extend .icon-marker;
        }
      }
      .ribbon {
        min-width: 150px;
        padding: 0 30px;
        height: 32px;
        line-height: 32px;
        font-size: 20px;
        position: absolute;
        right: -35px;
        top: 20px;
        text-align: center;
        background-color: #FE9B20;
        color: #fff;
        transform: rotate(45deg);
      }
      footer {
        padding: 20px 0;
        border-top: 2px dashed $lightGray;
        display: inline-flex;
        width: 100%;
        color: $black;
        p {
          flex: 1;
        }
        i {
          width: 48px;
          height: 48px;
          @extend .icon-phone;
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  /*eslint-disable no-unused-vars*/
  import Wechat from '../../methods/Wechat'
  import Config from '../../methods/Config'
  import Util from '../../methods/Util'
  import loading from '../../components/loading/juhua.vue'
  import Toast from '../../components/tips/Toast.vue'
  import GetLocation from '../../components/GetLocation.vue'
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
      Toast: Toast,
      GetLocation: GetLocation
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
                if (item.order_type === 3) {
                  item.url = `${Config.apiHost}dc/take-out.html#!/order_detail/${item.order_id}/${item.mchnt_id}`
                } else {
                  item.url = `${Config.apiHost}dc/?/#!/order_detail/${item.order_id}/${item.mchnt_id}`
                }
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
      }
    },
    events: {
      'on-getLocation' () {  // 获取地理位置接口
        Wechat.getLocation()
      }
    }
  }
</script>

<template>
  <div>
    <get-Location></get-Location>
    <ul class="store-list" v-if="!noData">
      <li v-for="item in responseData.list" @click='jumpUrl(item.userid, $event)'>
        <figure>
          <img :src="(item.head_img ? item.head_img : 'http://near.m1img.com/op_upload/155/149432051742.png') + '?imageView2/1/w/200/h/150'" alt="店铺图片">
        </figure>
        <div>
          <h3>{{item.shopname}}</h3>
          <p class="address">{{item.address}}</p>
          <p v-if="item.distance" class="distance"><strong><i></i>{{item.distance}}</strong><span v-if="item.overdist"><i></i>超出配送范围</span></p>
        </div>
        <footer>
          <p>
            <span v-if="item.durations.length>0">配送时间:
              <span v-for="(value, index) in item.durations" v-if="index<3">{{value.start_time.substring(0, 5)}}-{{value.end_time.substring(0, 5)}}
                <i v-if="index < item.durations.length -1 && index < 2"> , </i>
              </span>
              <i v-if="item.durations.length>3">...</i>
            </span>
            <span v-if="item.rules[0].shipping_fee">配送费：¥{{item.rules[0].shipping_fee | formatCurrency}}
              <span>（¥{{item.rules[0].start_delivery_fee | formatCurrency}}起送）</span>
            </span>
          </p>
          <a :href="'tel:' + item.telephone"></a>
        </footer>
        <span class="ribbon" :class="{orange: item.consumed, show: item.consumed}">{{item.consumed ? '上次去过' : '离我最近'}}</span>
      </li>
    </ul>
    <div v-if="noData" class="no-data">
      <img src="../assets/no_data.png" alt="">
      <p>暂无数据</p>
    </div>
    <loading :visible="loading"></loading>
  </div>
</template>
<script type="text/ecmascript-6">
  /* eslint-disable no-unused-vars */
  import Wechat from 'methods/Wechat'
  import Config from 'methods/Config'
  import loading from 'components/loading/juhua.vue'
  import GetLocation from 'components/GetLocation.vue'
  export default {
    data () {
      return {
        userId: this.$route.params.mchnt_id,
        groupId: this.$route.params.group_id,
        firstRequest: true,
        loading: false,
        loaded: false,
        responseData: {
          list: []
        },
        noData: false
      }
    },
    computed: {

    },
    components: {
      loading, GetLocation
    },
    created () {
      let _this = this
      let longitude = 0
      let _t = setInterval(function () {
        longitude = window.localStorage.getItem('longitude')
        if (longitude) {
          _this.getData()
          clearInterval(_t)
        }
      }, 1000)
    },
    mounted () {
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
      requestData () {
        let data = {
          format: 'jsonp',
          longitude: window.localStorage.getItem('longitude'),
          latitude: window.localStorage.getItem('latitude'),
          pagesize: 10,
          page: 1
        }
        if (this.groupId) {
          data.groupid = this.groupId
        }
        if (this.userId) {
          data.userid = this.userId
        }
        return data
      },
      getData () {
        let _this = this
        if (!this.loaded) {
          this.loading = true
          if (!this.firstRequest) {
            this.requestData.page += 1
          }
          this.$http({
            url: Config.apiHost + 'diancan/c/mchnt_list',
            params: _this.requestData(),
            method: 'JSONP'
          }).then(function (response) {
            let res = response.data
            _this.init = false
            _this.firstRequest = false
            _this.loading = false
            if (res.respcd === '0000') {
              _this.responseData.list = _this.responseData.list.concat(res.data.mchnts)
              if (res.data.mchnts.length === 0) {
                _this.noData = true
              }
              if (res.data.mchnts.length < 10) {
                _this.loaded = true
              }
            } else {
              _this.$toast(res.resperr)
            }
          })
        }
      },
      jumpUrl (mchntId, e) {
        if (e.target.nodeName !== 'A') {
          window.location.href = `${Config.apiHost}dc/take-out.html?/#!/merchant/${mchntId}`
        }
      }
    }
  }
</script>
<style scoped lang="scss" type="scss" rel="stylesheet/scss">
  @import "../../../styles/base/_reset";
  @import "../../../styles/base/_var";
  @import "../../../styles/iconfont/iconfont.css";
  html {
    height: 100%;
  }

  body {
    background-color: #F7F7F7;
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
  .icon-warn {
    background-image:url("../assets/warn-icon.png");
    @extend .icon;
  }
  .store-list {
    list-style: none;
    padding-left: 0;
    background-color: #fff;
    li {
      display: flex;
      display: -webkit-box;
      display: -webkit-flex;
      flex-wrap: wrap;
      -webkit-flex-wrap:wrap;
      -webkit-box-lines:multiple;
      position: relative;
      overflow: hidden;
      border-bottom: 2px solid $lightGray;
      padding: 30px 26px 0 30px;
      font-size: 24px;
      &:first-child .ribbon{
        display: block;
      }
      figure {
        width: 200px;
        position: relative;
        img {
          width: 100%;
        }
      }
      div {
        flex: 1;
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
        color: $black;
        margin-bottom: 20px;
        strong {
          font-size: 28px;
          font-weight: bold;
          i {
            width: 22px;
            height: 22px;
            @extend .icon-marker;
          }
        }
        span {
          font-size: 24px;
          color: #FD5359;
          float: right;
          i {
            width: 24px;
            height: 24px;
            vertical-align: middle;
            @extend .icon-warn;
          }
        }
      }
      .ribbon {
        display: none;
        padding: 0 30px;
        height: 32px;
        line-height: 32px;
        font-size: 20px;
        position: absolute;
        right: -35px;
        top: 20px;
        text-align: center;
        background-color: #FD5359;
        color: #fff;
        transform: rotate(45deg);
        &.show {
          display: block;
        }
        &.orange {
          background-color: #FE9B20;
        }
      }
      footer {
        padding: 20px 0;
        border-top: 2px dashed $lightGray;
        width: 100%;
        color: $black;
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        align-items: center;
        -webkit-box-align: center;
        -webkit-align-items: center;
        justify-content: space-between;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        p {
          >span {
            display: block;
            line-height: 40px;
            &:first-child {
              color: #8A8C92;
            }
            &:nth-child(2) {
              font-family: PingFang SC-Medium;
            }
          }
        }
        a {
          width: 36px;
          height: 49px;
          @extend .icon-phone;
        }
      }
    }
  }
</style>

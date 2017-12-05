<template>
  <div>
    <ul class="store-list" v-if="!noData">
      <li v-for="item in storeList" @click='jumpUrl(item.userid, $event)'>
        <figure>
          <img :src="(item.head_img ? item.head_img : 'http://near.m1img.com/op_upload/155/149432051742.png') + '?imageView2/1/w/200/h/150'" alt="店铺图片">
        </figure>
        <div>
          <h3>{{item.shopname}}</h3>
          <p class="address">{{item.address}}</p>
        </div>
        <span class="ribbon" v-if="item.consumed" :class="{orange: item.consumed, show: item.consumed}">上次去过</span>
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
  import Config from 'methods/Config'
  import loading from 'components/loading/juhua.vue'
  export default {
    data () {
      return {
        userId: this.$route.params.mchnt_id,
        firstRequest: true,
        loading: false,
        loaded: false,
        storeList: [],
        page: 1,
        noData: false
      }
    },
    components: {
      loading
    },
    created () {
      this.getData()
    },
    mounted () {
      let _this = this
      window.onscroll = () => {
        var scrollHeight = document.body.scrollHeight
        var windowScrollTop = window.scrollY
        var innerHeight = window.innerHeight
        if (windowScrollTop + innerHeight >= scrollHeight && !_this.loading) {
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
            this.page += 1
          }
          this.$http({
            url: Config.apiHost + 'diancan/c/ts_mchnt_list',
            params: {
              format: 'jsonp',
              userid: this.userId,
              page: this.page
            },
            method: 'JSONP'
          }).then(function (response) {
            let res = response.data
            _this.firstRequest = false
            _this.loading = false
            if (res.respcd === '0000') {
              _this.storeList = _this.storeList.concat(res.data.mchnts)
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
        let path = Config.env === 'development' ? '' : '/dc/'
        let address = this.$route.query.address
        if (e.target.nodeName !== 'A') {
          if (address) { // 带桌号
            window.location.href = `${window.location.origin}${path}/index.html?/#/merchant/${mchntId}/${address}`
          } else {
            window.location.href = `${window.location.origin}${path}/index.html?/#/merchant/${mchntId}`
          }
        }
      }
    }
  }
</script>
<style lang="scss" type="scss" rel="stylesheet/scss">
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
  .store-list {
    list-style: none;
    padding-left: 0;
    background-color: #fff;
    li {
      display: flex;
      display: -webkit-box;
      display: -webkit-flex;
      position: relative;
      overflow: hidden;
      border-bottom: 2px solid $lightGray;
      padding: 30px 26px 30px 30px;
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
        -webkit-box-flex:1;
        -webkit-flex:1;
        padding-left: 20px;
        h3 {
          margin-bottom: 20px;
          font-size: 30px;
        }
      }
      .address {
        font-size: 24px;
        line-height: 36px;
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
    }
  }
</style>

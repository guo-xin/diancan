<template>
  <div id="app-container">
    <!-- <router-view class="view-container"></router-view> -->
    <router-view></router-view>
    <toast :msg.sync="msg"></toast>
  </div>
</template>

<script>
  import Wechat from '../../methods/Wechat'
  import {Store} from '../../methods/Store'
  import {STORE_CART} from '../../methods/Config'
  import Toast from '../../components/tips/Toast'

  export default {
    components: {
      Toast
    },
    data () {
      return {
        user: {
          open_id: ''
        },
        mchnt_id: '',
        appId: '',
        cart: [],
        msg: '',
        deliver: {
          isFee: false,
          needFee: false,
          originFee: 0,
          freeDeliverFee: 0,
          startDeliveryFee: 0
        },
        current_addr: {},
        addr: [],
        tempAddr: {}
      }
    },
    ready () {
      if (window.location.hash === '#!/') {
        let url = window.location.origin + window.location.pathname + window.location.search + window.localStorage.getItem('redirect_uri')
        window.location.replace(url)
      }
      this.setOpenId()
      this.getCustomerAddr()
    },
    methods: {
      setOpenId () {
        this.user.open_id = window.localStorage.getItem('dc_openid') || ''
        this.appId = window.localStorage.getItem('dc_appid') || ''
      },
      getKey (mchntId) {
        return STORE_CART + '_' + mchntId
      },
      saveCart (mchntId) {
        Store.set(this.getKey(mchntId), this.cart, 5 * 60 * 60 * 1000)
      },
      getCustomerAddr () {
        let longitude = window.localStorage.getItem('longitude')
        let latitude = window.localStorage.getItem('latitude')
        Wechat.getFormattedAddress(longitude, latitude)
      }
    },
    events: {
      'on-toast' (msg) {
        this.msg = msg
      },
      'on-changeCart' (goods, specIndex, mchntId) {
        let divGoods = Object.assign({}, goods, {_specIndex: specIndex})
        let index = -1
        let spec = goods.spec_list[specIndex]
        this.cart.find((g, _index) => {
          let isfind = g.spec_list[g._specIndex].id === spec.id
          if (isfind) {
            index = _index
          }
          return isfind
        })
        if (index < 0) {  // 新增
          spec._count = 1
          this.cart.push(divGoods)
        } else {
          if (spec._count) { // 修改数量
            this.cart.$set(index, divGoods)
          } else {  // 移除
            this.cart.splice(index, 1)
          }
        }
        this.saveCart(mchntId)
      },
      'on-saveCart' (mchntId, cart) {
        this.$set('cart', cart || [])
        this.saveCart(mchntId)
      },
      'on-getCart' (mchntId) {
        this.$set('cart', Store.get(this.getKey(mchntId)) || [])
      },
      'on-cleanCart' (mchntId) {  // 清空购物车
        this.$set('cart', [])
        this.saveCart(mchntId)
      },
      'on-hideOptionMenu' () {  // 隐藏右上角菜单
        Wechat.hideOptionMenu()
      },
      'on-onMenuShareAppMessage' (args = {}) {  // 分享给朋友
        Wechat.onMenuShareAppMessage(args)
      },
      'on-qr' () {
        Wechat.onScanQRcode()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../styles/main.scss";
  @import "../../styles/iconfont/iconfont.css";
  /*@import '~vux/dist/vux.css';*/

  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td {
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    font-weight: inherit;
    font-style: inherit;
    font-size: 100%;
    vertical-align: baseline;
  }

  ol, ul, li {
    list-style: none;
  }

  // fix Font Boosting
  p, div {
    max-height: 999999px;
  }

  a {
    text-decoration: none;
    &:link, &:visited, &:hover, &:active {
      text-decoration: none;
    }
  }

  em {
    font-style: normal;
  }

  // 文字中划线
  .text-line-through {
    text-decoration: line-through;
  }

  // 美元
  .dollar {
    font-style: normal;
    font-size: 75%;
  }

  .one_text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .l-g_15 {
    line-height: 1.5;
  }

  .btn {
    /*display: inline-block;*/
    appearance: none;
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    /*background-image: none;*/
    border: 0;
    outline: 0;
    white-space: nowrap;
    /*line-height: 1.5;*/
    /*padding: 4px 15px;*/
    border-radius: 6px; /*px*/
    user-select: none;
    /*transition: all .3s cubic-bezier(.645, .045, .355, 1);*/
    /*transform: translate3d(0, 0, 0);*/
  }
  #app-container {
    height: 100%;
    min-height: 100%;
    background-color: #f7f7f7;
    position: relative;
  }
</style>

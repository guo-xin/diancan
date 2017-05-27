<template>
  <div id="app">
    <router-view
      @click="testToast"
      @toast="toast"
      :cart="cart"
      @changeCart="changeCart"
      @saveCartEv="saveCartEv"
      @getCart="getCart"
      @hideOptionMenu="hideOptionMenu"
      @menuShareAppMessage="menuShareTimeline"
      @menuShareTimeline="menuShareTimeline"
      @qr="qr">
    </router-view>
    <toast :msg.sync="msg"></toast>
  </div>
</template>

<script>
  import Wechat from 'methods/Wechat'
  import Store from 'methods/Store'
  import { STORE_CART } from 'methods/Config'
  import Toast from 'components/tips/Toast'

  export default {
    components: {
      Toast
    },
    data () {
      return {
        user: {
          open_id: ''
        },
        appId: '',
        cart: [],
        msg: ''
      }
    },
    created () {
      // 清空购物车
      this.$root.eventHub.$on('cleanCart', (mchntId) => {
        this.cart = []
        this.saveCartEv(mchntId, [])
      })
    },
    mounted () {
      if (window.location.hash === '#!/') {
        let url = window.location.origin + window.location.pathname + window.location.search + window.localStorage.getItem('redirect_uri')
        window.location.replace(url)
      }
      this.setOpenId()
    },
    methods: {
      testTost () {
        this.$toast('Test Toast!')
      },
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
      toast (msg) {
        this.msg = msg
      },
      changeCart (goods, specIndex, mchntId) {
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
            this.$set(this.cart, index, divGoods)
          } else {  // 移除
            this.cart.splice(index, 1)
          }
        }
        this.saveCart(mchntId)
      },
      saveCartEv (mchntId, cart) {
        this.cart = cart || []
        this.saveCart(mchntId)
      },
      getCart (mchntId) {
        this.cart = Store.get(this.getKey(mchntId)) || []
      },
      hideOptionMenu () {  // 隐藏右上角菜单
        Wechat.hideOptionMenu()
      },
      menuShareAppMessage (args = {}) {  // 分享给朋友
        Wechat.onMenuShareAppMessage(args)
      },
      menuShareTimeline (args = {}) {
        Wechat.onMenuShareTimeline(args)
      },
      qr () {
        Wechat.onScanQRcode()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../styles/main.scss";
  @import "../../styles/iconfont/iconfont.css";
  /*@import '~vux/dist/vux.css';*/

  html, body, div, span, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, address, big, code, del, em, img, small, strong, dl, dt, dd, ol, ul, li, fieldset, form, textarea, label, table, caption, tbody, tfoot, thead, tr, th, td {
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

</style>

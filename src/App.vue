<template>
  <div id="app-container">
    <router-view class="view-container"></router-view>
    <toast :msg="msg"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
//  import Util from './Util'
  import {Store} from './methods/Store'
  import {STORE_CART} from './methods/Config'
  import Toast from './components/tips/Toast'

  export default {
    components: {
      Toast
    },
    data () {
      return {
        user: {
//          open_id: 'oYkCztztAhQhfP9X3DEHz0X9q5Jk'  // TODO ????
//          open_id: 'oCyV1t0g7oVLCWiQTy93JXWdiL1U'  // TODO ????
          open_id: ''  // TODO ????
        },
        cart: [],
        msg: ''
      }
    },
    ready () {
      this.setOpenId()
//      this.$set('cart', Store.get(STORE_CART) || [])
//      console.log(document.getElementsByClassName('view-container'))
//      document.getElementsByClassName('view-container')[0].style.minHeight = window.innerHeight + 'px'
    },
    methods: {
      setOpenId () {
        this.user.open_id = window.localStorage.getItem('openid') || ''
//        this.user.open_id = 'oYkCztw6_I5u-Bp3w5rSdKlZ3wQw'
//        if (!open_id) {
//          let params = Util.getRequestParams(window.location.href)
//          console.log(params)
//          let code = params.code || ''
// //          let openid = params.openid || window.localStorage.getItem('openid') || ''
//          if (code) {
//            // let host = 'http://api.haojin.in/'
//            let host = 'https://qtapi.qa.qfpay.net/'
//            window.location.href = host + 'diancan/weixincallback?redirect_url=' + window.localStorage.redirect_uri + '&code=' + code
//          } else {
//            console.error('CODE 不存在...')
//          }
//          window.localStorage.setItem('openid', )
//        }
      },
      getKey (mchntId) {
        return STORE_CART + '_' + mchntId
      },
      saveCart (mchntId) {
        Store.set(this.getKey(mchntId), this.cart, 5 * 60 * 60 * 1000)
      }
    },
    events: {
      'on-toast' (msg) {
        this.msg = msg
      },
      'on-changeCart' (goods, mchntId) {
        let index = -1

        this.cart.find((g, _index) => {
          if (g.id === goods.id) {
            index = _index
          }
          return g.id === goods.id
        })
        if (index < 0) {  // 新增
          goods._count = 1
          this.cart.push(goods)
        } else {
          if (goods._count) { // 修改数量
            this.cart.$set(index, goods)
          } else {  // 移除
            this.cart.splice(index, 1)
          }
        }
        this.saveCart(mchntId)
      },
      'on-getCart' (mchntId) {
        this.$set('cart', Store.get(this.getKey(mchntId)) || [])
      },
      'on-cleanCart' (mchntId) {  // 清空购物车
        this.$set('cart', [])
        this.saveCart(mchntId)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "styles/main.scss";
  @import "styles/iconfont/iconfont.css";
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
    font-size: 70%;
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

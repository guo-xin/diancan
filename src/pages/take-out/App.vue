<template>
  <div id="app-container">
    <router-view
      :cart="cart"
      :deliver="deliver"
      @changeCart="changeCart"
      @saveCartEv="saveCartEv"
      @getCart="getCart"
      @updateDeliver="updateDeliver">
    </router-view>
  </div>
</template>

<script>
  import Store from '../../methods/Store'
  import {STORE_CART} from '../../methods/Config'

  export default {
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
      setOpenId () {
        this.user.open_id = window.localStorage.getItem('dc_openid') || ''
        this.appId = window.localStorage.getItem('dc_appid') || ''
      },
      getKey (mchntId) {
        return STORE_CART + '_' + mchntId
      },
      updateDeliver (newDeliver) {
        this.deliver = newDeliver
      },
      saveCart (mchntId) {
        Store.set(this.getKey(mchntId), this.cart, 5 * 60 * 60 * 1000)
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
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../styles/main.scss";
  @import "../../styles/iconfont/iconfont.css";

  body {
    background-color: #f7f7f7;
    font-size: 100%;
  }

  ul, p, h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0;
  }

  ol, ul {
    list-style: none;
    padding-left: 0
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

  #app-container {
    height: 100%;
    min-height: 100%;
    font-size: 30px;
    position: relative;
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

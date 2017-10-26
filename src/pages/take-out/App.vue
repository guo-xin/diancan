<template>
  <div id="app-container">
    <router-view
      :deliver="deliver"
      @updateDeliver="updateDeliver">
    </router-view>
  </div>
</template>

<script>
  import store from '../../vuex/store'

  export default {
    store,
    data () {
      return {
        user: {
          open_id: ''
        },
        mchnt_id: '',
        appId: '',
        deliver: {
          shipping_fee: 0,
          min_shipping_fee: 0,
          start_delivery_fee: 0
        },
        current_addr: {},
        tempAddr: {}
      }
    },
    created () {
      let jsApiList = [
        'checkJsApi',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'hideMenuItems',
        'showMenuItems',
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'scanQRCode'
      ]
      this.$wechat.init(jsApiList)
    },
    computed: {
      carts () {
        return this.$store.getters.getCarts
      }
    },
    mounted () {
      if (window.location.hash === '#!/' || window.location.hash === '#/') {
        let url = window.location.origin + window.location.pathname + window.location.search + window.sessionStorage.getItem('redirect_uri')
        window.location.replace(url)
      }
      this.setOpenId()
    },
    methods: {
      setOpenId () {
        this.user.open_id = sessionStorage.getItem('dc_openid') || ''
        this.appId = sessionStorage.getItem('dc_appid') || ''
      },
      updateDeliver (newDeliver) {
        this.deliver = newDeliver
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../styles/main.scss";
  @import "../../styles/iconfont/iconfont.css";

  // 移动端滚动穿透问题
  body.popup-open {
    position: fixed;
    width: 100%;
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

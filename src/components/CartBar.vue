<template>
  <div class="c-shopmenu-cart-bar">
    <div class="l-r shopmenu-cart-bar">
      <div class="l_auto cart-info" @click.stop.prevent="showList">
        <div class="cart-count">
          <img
            src="data:image/png;base64,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">
          <span class="count" v-show="cartData.count">{{cartData.count}}</span>
        </div>
        <div class="cart-price"><span>总价&nbsp;¥&nbsp;</span>{{cartData.price | formatCurrency}}</div>
      </div>
      <a class="row-status" href="javascript:;" @click="goNextView()">选好了</a>
    </div>
    <!--列表-->
    <div class="mask" v-show="visibleList" @click.stop="visibleList=false"></div>
    <transition name="totop">
      <div class="cart-list" v-show="visibleList">
        <div class="title" @click="cleanCartHandler()">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAABFZJREFUaAXtWs1rE0EUnzdJmxb8QMUv1Ap6ETwI3vRSPYjWi6jQqyBKKW0DTZPcBEVPTZpAkraoRfSif4DgJ2q96E30IHjx4jdKBVFp2jT7fLO6Mpmtqbuzy2ZhA2HfzLz3e+83v2FmYQeYh79S6VZirvb6AjI8wZCt1YIG9gWQX020bzuTTB6e08KSguOSrW0S2RuIeFQbSADQhCEzMnPzr7dT67gnmAQCXgHliuV9WMdHXuHJOBCD/ZnhoWm5z63N3QaqcWjgWbXPq7aX2J4ovJi6EON7M8ODT92QzhUre7BuPJFjvVLZE4VVBQDgrluygqSIBWD3ZMJqDnnMia1NOF8sHaMNprshKYdzDW03Dc7PNoRRDjNXQ6fzhuslnZucXMdma+L4OY/IElZqU92RoUNWW+eZGyvfoV3/oIVBqs/RNnuGdbZdy/T3f7b6nTxNwoXC5KY6LoxSYDcl2OQEQPalgmYBYXc6PfRK7ndr5/PlHQj4jCa00y0GCfCeYh/HIJ5NpfrfQ6l0eXN1vvqcDr41bkFFHAEjZ3BqZGTwig6OGjs2VjlpMJwiIVyvxt/1sa+Jts5dvFqrkrJ6ZInuNwb8iNdkRaEmJmGbOdTZcNCmVbJacOXAcJ+DOMkVZmgJPyFpMyuXt2/NpAZuSoOemgJb5ADOsmZOBjNuEgiuMJovoRycTSe1lo6M1Qq2yk/7WGoFUk5qiAg7ma0w+kJurPSBdrCNYSzeac204X3kDOGx08Cw+iODaZ5o78gQ869hJfH/dcNMR1tHlieTp9+JNxB6U7pOh/uH/wcIh6d4tRTc4jy+S3C1nbnqubXUuZwvlnuMOl4y6fPY6Wxq4E6zqfDbf6n6tY8lNNhFIrhZ/AGN38SbMPbbv0lqc0ifMOIWKwm94P+1rT71KfvItupntWUf2bbGnT61CTtNGLR/RDhoBfzOHyns9wwHjR8pHLQCfuePFPZ7hoPGjxQOWgG/80cK+z3DQeNHCgetgN/5I4X9nuGg8SOFg1bA7/yRwn7PcND4kcJBK+B3fm2F6TPGW6tI2bb61KfsI9uqn9WWfWTbGnf61CfMWR8lfSf+dAdD2E1/f3x882+anAa1rw+nh4duE86SXxysQvz2t/L866mt8L+AW7U/ItyqynhVl01h2gl/yODF4sXQ3P9Qa1W5CF42wgzxjUx4AWuNV4PlwRazbbUqXES5dsLKxWyagNGJiYlVLcbNVo5ZI9UqDyCH+3Jb2LZjKQZ8agGNJI2ZkyE+Qv+crb/IFSpZTMB0dmDgkwoSZHt0fHxDrGp0U4055YO5AbH4lFqb7Y6HcKCL2WUKHlSdw9SmW7Pj6ZGkjYN9SROrFcvaU3Tz/EGYCMq1AoOHXVs2pOQ+y16UcF9fX23lskQP7XIV+tct5xA8DaHs1q71Pb29vfOL1bvokpYdC4XKzjoap+gW2wHawLpobLk83gL2dyLxllbkPbH/pFKDL5vV9AvkBnZAJrqyNgAAAABJRU5ErkJggg==">
          <span>清空购物车</span>
        </div>
        <div class="cart-list_box" ref="cart">
          <ul v-show="cart.length">
            <li v-for="goods in cart">
              <div>
                <div class="name one_text">{{goods.name}}</div>
                <div class="goods-info">
                  <span class="price"><em class="dollar">¥&nbsp;</em>{{goods.spec_list[goods._specIndex].txamt | formatCurrency}}</span><span class="spec">{{goods.spec_list[goods._specIndex].name}}</span>
                </div>
              </div>
              <!--商品选择-->
              <goods-select class="goods-select-container"
                            :goods="goods"
                            :activate="goods._specIndex"
                            :plus="plus"
                            :minus="minus"
                            :diy="diy"></goods-select>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import BScroll from 'better-scroll'
  import GoodsSelect from '../components/GoodsSelect'
  export default {
    components: {
      GoodsSelect
    },
    props: ['cart', 'plus', 'minus', 'diy'],
    data () {
      return {
        visibleList: false,
        scroller: null
      }
    },
    created () {
      this.$nextTick(() => {
        this.scroller = new BScroll(this.$refs.cart, {
          startX: 0,
          startY: 0,
          click: true
        })
      })
    },
    computed: {
      cartData () {
        let count = 0
        let price = 0
        let cart = this.cart || []
        cart.forEach((goods, index) => {
          let spec = goods.spec_list[goods._specIndex]
          count += spec._count
          price += spec._count * spec.txamt
        })
        return {
          count,
          price
        }
      }
    },
    methods: {
      showList () {
        this.visibleList = !this.visibleList
        this.refresh()
      },
      cleanCartHandler () {
        this.$root.eventHub.$emit('cleanCart', this.$parent.mchnt_id)
        this.$emit('cleanGoods')
        this.visibleList = false
        this.refresh()
        _hmt.push(['_trackEvent', 'view-merchant', 'click-cleanCart'])
      },
      refresh () {
        this.$nextTick(() => {
          this.scroller.refresh()
          this.scroller.scrollTo(0, 0)
        })
      },
      goNextView () {
        this.$router.push({
          name: 'createOrder',
          params: {
            mchnt_id: this.$parent.mchnt_id,
            address: this.$route.params.address || ':address'
          }
        })
        _hmt.push(['_trackEvent', 'view-merchant', 'click-xuanhaoleBtn'])
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .c-shopmenu-cart-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 104px;
    z-index: 111;
  }

  .shopmenu-cart-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 104px;
    background-color: #2F323A;
    color: #fff;
    z-index: 9999;
    display: flex;
    align-items: center;
  }

  .cart-info {
    display: flex;
    padding-left: 26px;
  }

  .cart-count {
    position: relative;
    height: 50px;
    height: 52px;
    img {
      width: 50px;
      height: 52px;
    }
    /*&:before {*/
    .count {
      position: absolute;
      display: block;
      top: -16px;
      right: -16px;
      padding: 0 10px;
      box-sizing: border-box;

      /*padding: 2px 10px;*/
      min-width: 36px;
      height: 36px;
      line-height: 36px;
      border-radius: 18px;
      text-align: center;
      /*font-size: 32px;*/
      font-size: 26px;
      background-color: #FD5359;
    }
  }

  .cart-price {
    padding-left: 40px;
    font-size: 40px;
    span {
      /*font-size: 70%;*/
      font-size: 26px;
    }

  }

  .row-status {
    display: block;
    width: 200px;
    height: 104px;
    line-height: 104px;
    text-align: center;
    background-color: #FF8100;
    font-size: 36px;
    color: #fff;
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .cart-list {
    margin-bottom: 20px;
    position: absolute;
    bottom: 106px;
    left: 0;
    width: 100%;
    background-color: #fff;
    &:before {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 24px;
      width: 0;
      height: 0;
      border-left: 30px solid transparent;
      border-right: 30px solid transparent;
      border-top: 30px solid #fff;
    }
    .title {
      text-align: right;
      padding-right: 32px;
      height: 88px;
      line-height: 88px;
      font-size: 30px;
      background: #f7f7f7;
      color: #2F323A;
      span, img {
        vertical-align: middle;
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
    .cart-list_box {
      padding-left: 30px;
      padding-bottom: 20px;
      height: 655px;  // (127*5 + 20)
      overflow: hidden;
    }
    li {
      position: relative;
      /*height: 112px;*/
      padding: 20px 0;
      border-bottom: 2px solid #e5e5e5; /*px*/
      &:last-child {
        border-bottom: none;
      }
    }
    .name {
      font-size: 30px;
      color: #2f323a;
    }
    .goods-info {
      margin-top: 12px;
    }
    .price {
      margin-right: 18px;
      font-size: 34px;
      color: #fe9b20;
    }
    .spec {
      font-size: 26px;
      color: #8A8C92;
    }
    .goods-select-container {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .totop-enter-active, .totop-leave-active {
    transition: all .3s ease;
    transform: translateY(0);
  }
  .totop-enter, .totop-leave-active {
    opacity: 0;
    transform: translateY(110%);
  }
</style>

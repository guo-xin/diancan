<template>
  <div class="c-shopmenu-cart-bar" v-show="cartData.count">
    <div class="l-r shopmenu-cart-bar">
      <div class="l_auto cart-info" @click.stop.prevent="showList">
        <div class="cart-count">
          <img src="../assets/cart.png">
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
        <div class="title" @click="cleanCartHandle()">
          <img src="../assets/clean.png">
          <span>清空购物车</span>
        </div>
        <div class="cart-list_box" ref="cart">
          <ul v-show="carts.length">
            <li v-for="goods in carts">
              <div>
                <div class="name one_text">{{goods.name}}</div>
                <div class="goods-info">
                  <p class="spec">{{goods.spec.name}}{{goods.attrValuesString}}</p>
                  <span class="price"><em class="dollar">¥&nbsp;</em>{{goods.spec.txamt | formatCurrency}}</span>
                </div>
              </div>
              <!--商品选择-->
              <goods-select class="goods-select-container"
                            :goods="goods"
                            :goodsType="goods.type"
                            :count="goods.count"
                            :selectedSpecAttr="goods.selectedSpecAttr"
                            @updateGoodsCount="updateGoodsCount"
                            @updateCatesCount="updateCatesCount"
                            @changeCart="changeCart">
              </goods-select>
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
  import GoodsSelect from 'components/GoodsSelect'
  import store from '../vuex/store'
  export default {
    components: {
      GoodsSelect
    },
    props: ['updateGoodsCount', 'updateCatesCount'],
    data () {
      return {
        mchnt_id: this.$route.params.mchnt_id,
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
      carts () {
        return this.$store.getters.getCarts
      },
      cartData () {
        let count = 0
        let price = 0
        let carts = this.carts || []
        carts.forEach((goods, index) => {
          let spec = goods.spec
          count += goods.count
          price += goods.count * spec.txamt
        })
        return {
          count,
          price
        }
      }
    },
    methods: {
      changeCart (goods, count) {
        let cartIndex = this.carts.findIndex((g) => {
          if (g.type === 'spec') {
            return g.unionid === goods.unionid && g.spec.id === goods.spec.id
          } else if (g.type === 'attr') {
            return g.unionid === goods.unionid && g.attrValuesString === goods.attrValuesString
          } else { // 单规格商品 用unionid 判断
            return g.unionid === goods.unionid
          }
        })

        if (count === 0) {
          store.commit('DELCARTS', cartIndex) // 移除
        } else {
          store.commit('UPDATECARTCOUNT', { // +1
            index: cartIndex,
            count
          })
        }
        localStorage.setItem(`carts${this.mchnt_id}`, JSON.stringify(this.carts))
      },
      showList () {
        this.visibleList = !this.visibleList
        this.refresh()
      },
      cleanCartHandle () {
        store.commit('CLEANCARTS')
        localStorage.removeItem(`carts${this.mchnt_id}`)
        this.visibleList = false
        this.$emit('cleanCatesGoodsCount')
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

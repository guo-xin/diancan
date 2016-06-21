<template>
  <div class="">
    <div class="c-loading-container" v-if="$loadingRouteData">
      <loading :visible="$loadingRouteData"></loading>
    </div>

    <div id="c-restaurant-content-box" class="l-r">
      <div class="list-group-box">
        <scroller lock-x>
          <div class="list-group">
            <ul class="">
              <li v-for="group in groupList" :class="{'active': selectIndex===$index}"
                  @click="select($index, group)">
                <div>{{group.cate}}<span class="count" v-show="group._count">{{group._count  > 9 ? '...' : group._count}}</span>
                </div>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
      <div class="l_auto shopmenu-list-container">
        <!--<scroller lock-x scrollbar-y>-->
        <scroller lock-x v-ref:scroller>
          <div class="shopmenu-list">
            <no-data v-if="!goodsList.length" class="no-data"></no-data>
            <ul class="listgroup" v-else>
              <li v-for="goods in goodsList" track-by="id" class="list-item">
                <div class="l-r wrap">
                  <div class="list-img">
                    <div :style="{'background-image': 'url(' + goods.img + '_120s)'}"></div>
                  </div>
                  <div class="l_auto list-content">
                    <h4 class="title one_text">{{goods.name}}</h4>
                    <p class="description"></p>
                    <p class="price"><em class="dollar">¥&nbsp;</em>{{goods.txamt | formatCurrency}}</p>
                  </div>
                </div>
                <!--商品选择-->
                <goods-select class="goods-select-container"
                              :goods="goods"
                              :plus="plusHandler"
                              :minus="minusHandler"></goods-select>
              </li>
            </ul>
            <!--<div style="height: 50px"></div>-->
          </div>
        </scroller>
      </div>
    </div>

    <!--购物车-->
    <!--transition="totop1"-->
    <cart-bar :plus="plusHandler" :minus="minusHandler" v-if="cart.length" ></cart-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroller from 'vux-components/scroller'

  import NoData from '../components/NoData'
  import Loading from '../components/loading/Loading'
  import GoodsSelect from '../components/GoodsSelect'
  import CartBar from '../components/CartBar'

  import Config from '../methods/Config'

  //  import Api from '../api/mock'

  const STORAGEKEY = 'LIST-VIEW-goods_list'

  export default {
    components: {
      Loading, NoData, Scroller, CartBar, GoodsSelect
    },
    data () {
      return {
        mchnt_id: '',   // 商户id
        address: '',    // 桌号
//        cart: this.$root.cart,
        selectIndex: 0, // 激活分类
        groupList: [],  // 分类列表
        goodsList: []   // 商品列表
      }
    },
    computed: {
      cart () {
        return this.$root.cart
      }
    },
    created () {
//      MOCK Data
//      this.groupList = Api.goods_list.goods
//      this.$set('groupList', Api.goods_list.goods)
//      this.goodsList = this.groupList[0].goods_list
    },
    ready () {
      document.getElementById('c-restaurant-content-box').style.height = window.innerHeight + 'px'
//      let child = this.$refs.scroller
//      console.log(child)
//      child.reset()
    },
    route: {
      data (transition) {
        /**
         * mchnt_id     // 商户id
         */
        let args = this.$route.params
//        if (!args.mchnt_id) {
//          window.alert('商户ID不存在')
//          return
//        }
        args.format = 'jsonp'
        this.$http({
          url: Config.apiHost + 'diancan/c/goods_list',
          method: 'JSONP',
          data: args
        }).then(function (response) {
          // success callback
          let data = response.data
          if (data.respcd !== Config.code.OK) {
            this.$dispatch('on-toast', data.respmsg)
            // transition.abort()
            return
          }
          this.mchnt_id = args.mchnt_id
          this.setStorage(data.data)
          this.$dispatch('on-getCart', this.mchnt_id)
          let goods = this.mergeGoods(data.data.goods)
          transition.next({
            mchnt_id: args.mchnt_id,
            address: args.address || null,
            groupList: goods,
            goodsList: goods[0].goods_list
          })
          document.title = data.data.shopname
        }, function (response) {
          // error callback
        })
      }
    },
    methods: {
      getKey () {
        return STORAGEKEY + '_' + this.mchnt_id
      },
      mergeGoods (goods) {
        let cart = this.cart

        return goods.map(group => {
          let groupCount = 0
          group.goods_list = group.goods_list.map(goods => {
            let cartGoods = cart.find(g => {
              return goods.id === g.id
            })
            if (cartGoods) {
              goods._count = cartGoods._count
              groupCount += goods._count
            }
            return goods
          })
          group._count = groupCount
          return group
        })
      },
      select (index, item) {
        this.selectIndex = index
        this.$set('goodsList', item.goods_list)
        this.$nextTick(function () {
          let scroller = this.$refs.scroller
          scroller.reset()
          scroller._xscroll.scrollTop()
        })
      },
      plusHandler (event, goods) {
//        console.log(event)
//        var X = this.getBoundingClientRect().left + document.documentElement.scrollLeft
//        var Y = this.getBoundingClientRect().top + document.documentElement.scrollTop
//        console.log(X, Y)
        this.addCartHandler(goods, true)
      },
      minusHandler (goods) {
        this.addCartHandler(goods, false)
      },
      addCartHandler (goods, type) {
        type = type ? 1 : -1
        let index = -1
        let i = -1
        this.groupList.find((g, _index) => {
          if (g.cate_id === goods.cate_id) {
            index = _index
          }
          return g.cate_id === goods.cate_id
        })
        this.groupList[index].goods_list.find((g, _index) => {
          if (g.id === goods.id) {
            i = _index
          }
          return g.id === goods.id
        })

        if (index < 0) {
          return
        }

        // up group
        let oldGoods = this.groupList[index].goods_list[i]
        oldGoods._count = oldGoods._count || 0
        let newCount = oldGoods._count + type
        if (newCount < 0) {
          return
        }
        let newGoods = Object.assign({}, oldGoods, {_count: newCount})
        this.groupList[index].goods_list.$set(i, newGoods)

        this.$dispatch('on-changeCart', newGoods, this.mchnt_id)

        let oldGroup = this.groupList[index]
        oldGroup._count = oldGroup._count || 0
        let newGroup = Object.assign({}, oldGroup, {_count: oldGroup._count + type})
        this.groupList.$set(index, newGroup)
      },
      setStorage (data) {
        window.sessionStorage.setItem(this.getKey(), JSON.stringify(data))
      },
      getStorage () {
        return JSON.parse(window.sessionStorage.getItem(this.getKey()))
      }
    },
    events: {
      'on-cleanCart' (mchntId) {
        let data = this.getStorage() || {}
        let goods = data.goods || []

        this.$set('groupList', goods)
        this.$set('goodsList', goods[0].goods_list)
        return true
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

  .c-loading-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    z-index: 999;
  }

  .no-data {
    height: 300px !important;
  }

  /*左侧分类列表*/
  .list-group-box {
    height: 100%;
    width: 156px;
    background-color: #F7F7F7;
  }

  .list-group {
    /*padding-bottom: 70px;*/
    li {
      position: relative;
      text-align: center;
      padding: 30px 12px;
      font-size: 28px;
      color: #2F323A;
      border-bottom: 2px solid #E5E5E5; /*px*/

      &.active {
        background-color: #fff;
        color: #FE9B20;
      }

      /*&:before {*/
      .count {
        position: absolute;
        display: block;
        top: 4px;
        right: 4px;
        /*padding: 0 10px;*/

        /*padding: 2px 10px;*/
        min-width: 32px;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        text-align: center;
        /*font-size: 32px;*/
        font-size: 24px;
        color: #fff;
        background-color: #FD5359;
      }
    }
  }

  /*右侧选菜列表*/
  .shopmenu-list-container {
    height: 100%;
    background-color: #fff;

    & > div:first-child {
      /*background: #f2f2f2;*/
      /*background: url(https://static11.elemecdn.com/eleme/msite/img/scrollit.png) center 10px no-repeat;*/
      /*background-size: 90px;*/
    }
  }

  .shopmenu-list {
    background-color: #fff;
  }

  li.list-item {
    position: relative;
    padding-left: 24px;
    .wrap {
      position: relative;
      align-items: center;
      padding: 24px 0;
      border-bottom: 2px solid #E5E5E5; /*px*/
    }
    .list-img {
      display: block;
      left: 10px;
      top: 10px;
      width: 120px;
      height: 120px;
      background: url(../assets/shoplist-default.jpg) center center no-repeat;
      /*background-size: 50px 50px;*/
      > div {
        width: 120px;
        height: 120px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: top center;
      }
    }
    .list-content {
      padding-left: 24px;
      .title {
        color: #4d4d4d;
        font-size: 32px;
        line-height: 32px;
        color: #2f323a;
      }

      .description {
        height: 33px;
        margin: 8px 0;
        font-size: 26px;
        color: #8a8c92;
        line-height: 34px;
      }

      .price {
        font-size: 30px;
        color: #fe9b20;
        line-height: 40px;
      }
    }
  }

  .goods-select-container {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .totop1-transition {
    transition: all .3s ease;
  }

  .totop1-enter, .totop1-leave {
    transform: translateY(100%);
    /*opacity: 0;*/
  }
</style>

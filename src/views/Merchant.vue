<template>
  <div class="">
    <div class="c-loading-container" v-if="$loadingRouteData">
      <loading :visible="$loadingRouteData"></loading>
    </div>

    <div id="c-restaurant-content-box" class="l-r">
      <div class="list-group-box">
        <scroller class="scroller-left" lock-x v-ref:scrollerleft height="100%">
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
        <scroller class="scroller-right" lock-x v-ref:scroller height="100%">
          <div class="shopmenu-list">
            <no-data v-if="!goodsList.length" class="no-data"></no-data>
            <ul class="listgroup" v-else>
              <li v-for="goods in goodsList" class="list-item">
                <div class="l-r wrap">
                  <div class="list-img">
                    <div :style="{'background-image': 'url(' + goods.img + '_120s)'}"></div>
                  </div>
                  <div class="l_auto list-content">
                    <h4 class="title one_text">{{goods.name}}</h4>
                    <p class="old-price text-line-through" v-show="goods.spec_list[0].orgtxamt !== goods.spec_list[0].txamt">¥&nbsp;{{goods.spec_list[0].orgtxamt | formatCurrency}}</p>
                    <p class="price"><em class="dollar">¥&nbsp;</em>{{goods.spec_list[0].txamt | formatCurrency}}</p>
                  </div>
                </div>
                <!--商品选择-->
                <goods-select v-if="goods.spec_list.length===1" class="goods-select-container"
                              :goods="goods"
                              :plus="plusHandler"
                              :minus="minusHandler">
                </goods-select>
                <div v-else class="l-c-c goods-select-container spec-btn"><button @click="showSpecHandler(goods)">选择规格</button></div>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
    </div>

    <!--选择规格-->
    <select-spec :visible.sync="showSpec"
                 :goods="selectSpecGoods"
                 :plus="plusHandler"
                 :minus="minusHandler">
    </select-spec>

    <!--购物车-->
    <!--transition="totop1"-->
    <cart-bar :plus="plusHandler" :minus="minusHandler" v-if="cart.length" ></cart-bar>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import Util from '../methods/Util'
  import Scroller from 'vux-components/scroller'

  import NoData from '../components/NoData'
  import Loading from '../components/loading/Loading'
  import GoodsSelect from '../components/GoodsSelect'
  import SelectSpec from '../components/SelectSpec'
  import CartBar from '../components/CartBar'

  import Config from '../methods/Config'

  //  import Api from '../api/mock'

  const STORAGEKEY = 'LIST-VIEW-goods_list'

  export default {
    components: {
      Loading, NoData, Scroller, CartBar, GoodsSelect, SelectSpec
    },
    data () {
      return {
        mchnt_id: '',   // 商户id
        address: '',    // 桌号
        selectIndex: 0, // 激活分类
        groupList: [],  // 分类列表
        goodsList: [],  // 商品列表
        showSpec: false,
        selectSpecGoods: null
      }
    },
    computed: {
      cart () {
        return this.$root.cart
      }
    },
    created () {
    },
    ready () {
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
//          url: Config.apiHost + 'diancan/c/goods_list',
          url: 'http://172.100.111.215:9300/diancan/c/goods_list',
//          url: '/static/api/goods_list.json',
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

          this.$nextTick(() => {
            document.getElementsByClassName('list-group-box')[0].style.height = window.innerHeight + 'px'
            document.getElementsByClassName('shopmenu-list-container')[0].style.height = window.innerHeight + 'px'
            this.$refs.scrollerleft.reset()
            this.$refs.scroller.reset()
          })
          const shopname = data.data.shopname
          let shareLink = Config.rootHost + '?/#!/merchant/' + args.mchnt_id
          this.$dispatch('on-onMenuShareAppMessage', {title: '动一动手指，轻松点餐', desc: shopname + '不用排队，快来体验吧', link: shareLink})

          Util.setTitle(shopname)
        }, function (response) {
          // error callback
        })
      },
      canDeactivate (transition) {
        this.$dispatch('on-hideOptionMenu')
        transition.next()
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
            let specIndex = -1
            let cartGoods = cart.find(g => {
              let spec = goods.spec_list.find((spec, _index) => {
                if (spec.id === g.spec_list[g._specIndex].id) {
                  specIndex = _index
                }
                return spec.id === g.spec_list[g._specIndex].id
              })
              return spec
            })
            if (cartGoods) {
              let count = cartGoods.spec_list[cartGoods._specIndex]._count
              goods.spec_list[specIndex]._count = count
              groupCount += count
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
      plusHandler (event, goods, specIndex) {
        this.addCartHandler(goods, specIndex, true)
        _hmt.push(['_trackEvent', 'view-merchant', 'click-plusBtn'])
      },
      minusHandler (event, goods, specIndex) {
        this.addCartHandler(goods, specIndex, false)
        _hmt.push(['_trackEvent', 'view-merchant', 'click-minusBtn'])
      },
      addCartHandler (goods, specIndex, type) {
        console.log('specIndex_type_goods:', specIndex, type, goods)
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
          let spec = g.spec_list.find((spec, _specIndex) => {
            return spec.id === goods.spec_list[specIndex].id
          })
          if (spec) {
            i = _index
          }
          return spec
        })

        if (index < 0) {
          return
        }

        // up group
        let oldGoods = this.groupList[index].goods_list[i]
        let newCount = (oldGoods.spec_list[specIndex]._count || 0) + type
        if (newCount < 0) {
          return
        }
        let spec = Object.assign({}, oldGoods.spec_list[specIndex], {_count: newCount})
        this.groupList[index].goods_list[i].spec_list.$set(specIndex, spec)
        let newGoods = Object.assign({}, oldGoods)
        this.groupList[index].goods_list.$set(i, newGoods)

        this.$dispatch('on-changeCart', newGoods, specIndex, this.mchnt_id)

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
      },
      showSpecHandler (goods) {
        this.showSpec = true
        this.selectSpecGoods = goods
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
    /*padding-bottom: 104px;*/
    /*height: 100%;*/
    width: 156px;
    background-color: #F7F7F7;
  }

  .list-group {
    /*padding-bottom: 70px;*/
    padding-bottom: 104px;
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
    overflow: hidden;
    /*padding-bottom: 104px;*/
    height: 100%;
    background-color: #fff;

    & > div:first-child {
      /*background: #f2f2f2;*/
      /*background: url() center 10px no-repeat;*/
      /*background-size: 90px;*/
    }
  }

  .shopmenu-list {
    padding-bottom: 104px;
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
      background: url(../assets/default_food_pic.png) center center no-repeat;
      /*background-size: 50px 50px;*/
      background-size: 100%;
      > div {
        width: 120px;
        height: 120px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: top center;
      }
    }
    .list-content {
      overflow: hidden;
      padding-left: 24px;
      .title {
        color: #4d4d4d;
        font-size: 32px;
        /*line-height: 32px;*/
        color: #2f323a;
      }

      .description {
        height: 33px;
        margin: 8px 0;
        font-size: 26px;
        color: #8a8c92;
        line-height: 34px;
      }

      .old-price {
        font-size: 26px;
        line-height: 34px;
        color: #8A8C92;
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

  .spec-btn {
    /*position: absolute;*/
    /*right: 0;*/
    /*bottom: 0;*/

    width: 196px;
    height: 100px;
    button {
      width: 156px;
      height: 60px;
      border: 2px solid #C2C2C2;  /**/
      border-radius: 30px;
      background-color: #fff;
      font-size: 30px;
      color: #FE9B20;
    }
  }
</style>

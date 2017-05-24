<template>
  <div>
    <get-Location></get-Location>
    <div class="c-loading-container" v-if="isLoading">
      <loading :visible="isLoading"></loading>
    </div>
    <div class="order-info" v-show="isEmptyInfo">
      <p>你在 {{order_info.order_time | formatTime('hh:mm')}} 提交了一个订单
        <a @click="goDetail">查看订单</a>
      </p>
    </div>
    <div id="c-restaurant-content-box" class="l-r">
      <div class="list-group-box">
        <scroller class="scroller-left" lock-x ref="scrollerleft" height="100%">
          <div class="list-group">
            <ul class="">
              <li v-for="group in groupList" :class="{'active': selectIndex === index}"
                  @click="select(index, group)">
                <div>{{group.cate}}<span class="count" v-show="group._count">{{group._count  > 9 ? '...' : group._count}}</span>
                </div>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
      <div class="l_auto shopmenu-list-container">
        <scroller class="scroller-right" lock-x ref="scroller" height="100%">
          <div class="shopmenu-list">
            <no-data v-if="!goodsList.length" class="no-data"></no-data>
            <ul class="listgroup" v-else>
              <li v-for="goods in goodsList" class="list-item">
                <div class="l-r wrap">
                  <div class="list-img" @click.stop="showDetailHandler(goods)">
                    <div :style="{'background-image': 'url(' + goods.img + '?imageView2/1/w/120/h/120/format/jpg)'}"></div>
                  </div>
                  <div class="l_auto list-content">
                    <h4 class="title one_text" @click.stop="showDetailHandler(goods)">{{goods.name}}</h4>
                    <p class="old-price text-line-through" v-if="goods.spec_list[0].orgtxamt && goods.spec_list[0].orgtxamt !== goods.spec_list[0].txamt">¥&nbsp;{{goods.spec_list[0].orgtxamt | formatCurrency}}</p>
                    <p v-else class="old-price"></p>
                    <p class="price"><em class="dollar">¥&nbsp;</em>{{goods.spec_list[0].txamt | formatCurrency}}</p>
                  </div>
                </div>
                <!--商品选择-->
                <goods-select v-if="goods.spec_list.length===1" class="goods-select-container"
                              :goods="goods"
                              :plus="plusHandler"
                              :minus="minusHandler"
                              :diy="diyHandler">
                </goods-select>
                <div v-else class="l-c-c goods-select-container spec-btn" :class="{'select': hasSelect(goods)}"><button @click.stop="showSpecHandler(goods)">{{hasSelect(goods) ? '重选规格' : '选择规格' }}</button></div>
              </li>
            </ul>
          </div>
        </scroller>
      </div>
    </div>

    <!--选择规格-->
    <select-spec :visible.sync="showSpec"
                 :goods.sync="selectSpecGoods"
                 :plus="plusHandler"
                 :minus="minusHandler"
                 :diy="diyHandler">
    </select-spec>

    <goods-detail :visible.sync="showDetail"
                  :goods="selectDetail"></goods-detail>

    <!--购物车-->
    <cart-bar :plus="plusHandler" :minus="minusHandler" :diy="diyHandler"
      :overtime="merchantSetting.overtime" :nodelivery="merchantSetting.delivery_open_state === 0"
      v-if="cart.length"></cart-bar>

    <!--扫描二维码蒙层-->
    <scan-qrcode :display="isExpire"></scan-qrcode>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import Util from '../../../methods/Util'
  import Scroller from 'vux-components/scroller'

  import NoData from '../../../components/NoData'
  import Loading from '../../../components/loading/Loading'
  import GoodsSelect from '../../../components/GoodsSelect'
  import SelectSpec from '../../../components/SelectSpec'
  import CartBar from '../components/CartBar'
  import GoodsDetail from '../../../components/GoodsDetail'
  import ScanQrcode from '../../../components/ScanQrcode.vue'
  import GetLocation from '../../../components/GetLocation.vue'
  import Config from '../../../methods/Config'

  const STORAGEKEY = 'LIST-VIEW-goods_list'

  export default {
    components: {
      Loading, NoData, Scroller, CartBar, GoodsSelect, SelectSpec, GoodsDetail, ScanQrcode, GetLocation
    },
    data () {
      return {
        isLoading: true,
        mchnt_id: '',   // 商户id
        selectIndex: 0, // 激活分类
        groupList: [],  // 分类列表
        goodsList: [],  // 商品列表
        showSpec: false,
        selectSpecGoods: null,
        showDetail: false,
        selectDetail: null,
        order_info: {}, // 是否已存在订单
        isExpire: false,
        merchantSetting: {}
      }
    },
    computed: {
      cart () {
        return this.$root.cart
      },
      isEmptyInfo () {
        return !Util.isEmptyObject(this.order_info)
      }
    },
    mounted () {
      this.isLoading = false
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
        args.open_id = this.$root.user.open_id
        args.sale_type = 3
        this.$http({
          url: Config.apiHost + 'diancan/c/goods_list',
          // url: '/static/api/goods_list.json',
          method: 'JSONP',
          data: args
        }).then(function (response) {
          let data = response.data
          // 验证链接时间是否过期
          if (data.respcd === '4000') {
            this.isExpire = true
            return
          } else if (data.respcd !== Config.code.OK) {
            this.$dispatch('on-toast', data.respmsg)
            // transition.abort()
            return
          }
          this.mchnt_id = args.mchnt_id
          this.$root.mchnt_id = args.mchnt_id
          let mSet = data.data.merchant_setting
          if (mSet.shipping_fee !== undefined) {
            let deliver = this.$root.deliver
            deliver.isFee = true
            deliver.originFee = mSet.shipping_fee
            deliver.freeDeliverFee = mSet.min_shipping_fee
            deliver.startDeliveryFee = mSet.start_delivery_fee
          }
          this.setStorage(data.data)
          this.$dispatch('on-getCart', this.mchnt_id)
          let goods = this.mergeGoods(data.data.goods)
          transition.next({
            mchnt_id: args.mchnt_id,
            groupList: goods,
//            goodsList: goods[0].goods_list,
            goodsList: (function () {
              if (goods.length !== 0) {
                return goods[0].goods_list
              } else {
                return ''
              }
            })(),
            order_info: data.data.order_info,
            merchantSetting: mSet
//            order_info: {
//              order_id: '6149736680771744597',
//              order_time: 1469006994
//            }
          })
          this.$nextTick(() => {
            document.getElementsByClassName('list-group-box')[0].style.height = window.innerHeight + 'px'
            document.getElementsByClassName('shopmenu-list-container')[0].style.height = window.innerHeight + 'px'
            this.$refs.scrollerleft.reset()
            this.$refs.scroller.reset()
          })
          const shopname = data.data.shopname
          let shareLink = Config.rootHost + 'take-out.html?/#!/merchant/' + args.mchnt_id
          let imgUrl = data.data.logo_url || 'http://near.m1img.com/op_upload/8/14944084019.jpg'
          this.$dispatch('on-onMenuShareAppMessage', {title: `我在${shopname}叫了外卖，美食当然要和你一起分享！`, desc: '菜单在眼前，吃啥不纠结！', imgUrl: imgUrl, link: shareLink})
          this.$dispatch('on-onMenuShareTimeline', {title: `我在${shopname}叫了外卖，好吃到发朋友圈！快来看看~`, imgUrl: imgUrl, link: shareLink})

          Util.setTitle(shopname)
        }, function (response) {
          // error callback
        })
      },
      beforeRouteLeave (transition) {
        this.$dispatch('on-hideOptionMenu')
        transition.next()
      }
    },
    methods: {
      goDetail () {
        this.$router.push({name: 'orderDetail', params: {mchnt_id: this.mchnt_id, order_id: this.order_info.order_id}})
      },
      getKey () {
        return STORAGEKEY + '_' + this.mchnt_id
      },
      mergeGoods (goods) {
        goods.map(cate => {
          cate._count = 0
          cate.goods_list.map(g => {
            g._lastSpec = 0
            g.spec_list.map(spec => {
              spec._count = 0
              return spec
            })
            return g
          })
          return cate
        })

        let cart = this.cart
        let delArr = []
        let delCart = []
        cart.forEach((cartGoods, index) => {
          let hasFind = false
          let count = 0
          let cate = goods.find(cate => {
            return cartGoods.cate_id === cate.cate_id
          })
          if (cate) {
            let g = cate.goods_list.find(g => {
              return g.unionid === cartGoods.unionid
            })
            let _index = 0
            if (g) {
              let spec = g.spec_list.find((spec, _i) => {
                if (cartGoods.spec_list[cartGoods._specIndex].id) {
                  _index = _i
                }
                return spec.id === cartGoods.spec_list[cartGoods._specIndex].id
              })
              if (spec) {
                hasFind = true
                count = cartGoods.spec_list[cartGoods._specIndex]._count || 0
                spec._count = count
                g._lastSpec = g._lastSpec || _index
              }
            }
            cate._count += count
          }
          if (!hasFind) {
            let name = cartGoods.name + '(' + cartGoods.spec_list[cartGoods._specIndex].name + ')'
            delArr.push(name)
            delCart.push(index)
          }
        })
        delArr.length && this.$dispatch('on-toast', delArr.join(' ') + '已下架')
        delCart.reverse().forEach(item => {
          cart.splice(item, 1)
        })
        this.$dispatch('on-saveCart', this.mchnt_id, cart)
        return goods
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
      plusHandler (events, goods, specIndex) {
        this.addCartHandler(goods, specIndex, true)
        _hmt.push(['_trackEvent', 'view-merchant', 'click-plusBtn'])
      },
      minusHandler (events, goods, specIndex) {
        this.addCartHandler(goods, specIndex, false)
        _hmt.push(['_trackEvent', 'view-merchant', 'click-minusBtn'])
      },
      diyHandler (events, goods, specIndex, number) {
        this.addCartHandler(goods, specIndex, number)
        _hmt.push(['_trackEvent', 'view-merchant', 'click-diyBtn'])
      },
      addCartHandler (goods, specIndex, type) {
        let isDIY = false
        if (type === true) {
          type = 1
        } else if (type === false) {
          type = -1
        } else {
          isDIY = true
        }
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
        let newCount = isDIY ? type : (oldGoods.spec_list[specIndex]._count || 0) + type
        if (newCount < 0) {
          return
        }
        let spec = Object.assign({}, oldGoods.spec_list[specIndex], {_count: newCount})
        this.$set(this.groupList[index].goods_list[i].spec_list, specIndex, spec)
        let newGoods = Object.assign({}, oldGoods)
        this.$set(this.groupList[index].goods_list, i, newGoods)

        this.$dispatch('on-changeCart', newGoods, specIndex, this.mchnt_id)

        let oldGroup = this.groupList[index]
        oldGroup._count = oldGroup._count || 0
        let newGroup = Object.assign({}, oldGroup, {_count: isDIY ? type : oldGroup._count + type})
        this.$set(this.groupList, index, newGroup)
      },
      hasSelect (goods) {
        return !!goods.spec_list.find(spec => spec._count)
      },
      setStorage (data) {
        window.sessionStorage.setItem(this.getKey(), JSON.stringify(data))
      },
      getStorage () {
        return JSON.parse(window.sessionStorage.getItem(this.getKey()))
      },
      showSpecHandler (goods) {
        this.selectSpecGoods = goods
        this.showSpec = true
      },
      showDetailHandler (goods) {
        this.selectDetail = goods
        this.showDetail = true
      }
    },
    events: {
      'on-selectSpec' (goods, specIndex) {
        this.goodsList.find(g => g.unionid === goods.unionid)._lastSpec = specIndex
      },
      'on-cleanCart' (mchntId) {
        let data = this.getStorage() || {}
        let goods = data.goods || []
        goods.map(group => {
          return group.goods_list.map(goods => {
            goods._lastSpec = 0
            return goods
          })
        })

        this.$set('groupList', goods)
        this.$set('goodsList', goods[this.selectIndex].goods_list)
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
  .order-info {
    background-color: #FFEAD1;
    line-height: 60px;
    padding: 20px;
    transition: all .5s linear;
    height: 100px;
    overflow: hidden;
    p {
      font-size: 30px;
      color: #2F323A;
      a {
        display: block;
        float: right;
        padding: 16px 24px;
        color: #fff;
        text-align: center;
        font-size: 30px;
        border-radius: 6px;
        background-color: #FE9B20;
        line-height: 1;
      }
    }
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
      background: url(../../../assets/default_food_pic.png) center center no-repeat;
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
        height: 34px;
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

  .select {
    button {
      border: 0 !important;
      background-color: #FE9B20 !important;
      color: #fff !important;
    }
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
      padding: 0 28px;
      border: none;
      background-color: #FF8100;
      height: 60px;
      border-radius: 30px;
      font-size: 24px;
      color: #fff;
    }
  }
</style>

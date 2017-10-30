<template>
  <div>
    <get-Location></get-Location>
    <get-store-info :merchantSetting="merchantSetting" :mchntActivity="mchntActivity"
                    @showStoreDetailHandler="showStoreDetailHandler()" ref="getStore"></get-store-info>
    <store-info-detail :merchantSetting="merchantSetting" :mchntActivity="mchntActivity" :visible="showStoreDetail"
                       @hideStoreDetailHandler="hideStoreDetailHandler()"></store-info-detail>
    <div class="tabbar">
      <span :class="{'active':!showOrderList}" @click="toggleTab('menu')">菜单</span><span :class="{'active':showOrderList, 'hasorder': hasOrder}" @click="toggleTab('order')">订单</span>
    </div>
    <div id="c-restaurant-content-box" class="l-r" v-show="!showOrderList">
      <div class="list-group-box">
        <div class="list-group" ref="group">
          <ul>
            <li v-for="(cate, index) in cateList" :class="{'active': selectIndex === index}" @click="cateSelect(index)">
              <div>
                {{cate.name}}<span class="count" v-show="cate.cate_count">{{cate.cate_count > 9 ? '···' : cate.cate_count}}</span>
              </div>
            </li>
            <li class="speceBottom"></li>
          </ul>
        </div>
      </div>

      <div class="l_auto shopmenu-list-container">
        <div class="shopmenu-list" ref="menu">
          <ul v-show="goodsList.length">
            <li v-for="goods in goodsList" class="list-item">
              <div class="l-r wrap">
                <div class="list-img" @click.stop="showDetailHandler(goods)">
                  <div :style="{'background-image': 'url(' + goods.img + '?imageView2/1/w/120/h/120/format/jpg)'}"></div>
                </div>
                <div class="l_auto list-content">
                  <h4 class="title" @click.stop="showDetailHandler(goods)">{{goods.name}}</h4>
                  <p class="old-price text-line-through" v-if="goods.spec_list[0].orgtxamt && goods.spec_list[0].orgtxamt !== goods.spec_list[0].txamt">¥&nbsp;{{goods.spec_list[0].orgtxamt | formatCurrency}}</p>
                  <p v-else class="old-price"></p>
                  <p class="price"><em class="dollar">¥&nbsp;</em>{{goods.spec_list[0].txamt | formatCurrency}}</p>
                </div>
              </div>
              <!-- 商品+-选择 -->
              <goods-select v-if="goods.spec_list.length === 1" class="goods-select-container"
                            :goods="goods"
                            :goodsType="'single'"
                            :count="goods.count"
                            @updateGoodsCount="updateGoodsCount"
                            @changeCart="changeCartSingle">
              </goods-select>

              <div v-else class="l-c-c goods-select-container spec-btn">
                <span @click.stop="showSpecHandler(goods)">{{hasSelect(goods) ? '重选规格' : '选择规格' }}</span>
                <p v-if="hasNumber(goods) > 0" class="goods-select-number">{{ hasNumber(goods) > 9 ? '···' : hasNumber(goods) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--选择规格-->
      <select-spec :visible="showSpec"
                   :goods="selectSpecGoods"
                   :updateCatesCount="updateCatesCount"
                   @hideSpecHandler="hideSpecHandler">
      </select-spec>

      <goods-detail :visible="showDetail"
                    @hideDetailHandler="hideDetailHandler"
                    :goods="selectDetail"></goods-detail>

      <!-- 购物车 -->
      <cart-bar :updateGoodsCount="updateGoodsCount"
                :updateCatesCount="updateCatesCount"
                :overtime="merchantSetting.overtime"
                :nodelivery="merchantSetting.delivery_open_state === 0"
                :deliver="deliver"
                @cleanCatesGoodsCount="cleanCatesGoodsCount"></cart-bar>
    </div>

    <!-- 订单列表 -->
    <div class="order-wrapper" ref="order" v-show="showOrderList">
      <order-list ref="orderlist" :useTabs="true" @updateOrdersLoaded="updateOrdersLoaded" @goOrderList="goOrderList"></order-list>
    </div>

    <!--扫描二维码蒙层-->
    <scan-qrcode :display="isExpire"></scan-qrcode>

    <loading :visible="isLoading"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import Util from 'methods/Util'
  import Loading from 'components/loading/Loading'
  import GoodsSelect from 'components/GoodsSelect'
  import SelectSpec from 'components/SelectSpec'
  import CartBar from '../components/CartBar'
  import GoodsDetail from 'components/GoodsDetail'
  import ScanQrcode from 'components/ScanQrcode.vue'
  import GetLocation from 'components/GetLocation.vue'
  import GetStoreInfo from 'components/GetStoreInfo.vue'
  import StoreInfoDetail from 'components/StoreInfoDetail.vue'
  import OrderList from '../../order-list/App.vue'
  import Config from 'methods/Config'
  import BScroll from 'better-scroll'
  import store from '../../../vuex/store'

  export default {
    props: ['deliver'],
    components: {
      Loading, CartBar, GoodsSelect, SelectSpec, GoodsDetail, ScanQrcode, GetLocation, GetStoreInfo, StoreInfoDetail, OrderList
    },
    data () {
      return {
        isLoading: false,
        mchnt_id: '',   // 商户id
        showOrderList: false,
        firstLoadOrders: true,
        selectIndex: 0, // 激活分类
        allGoods: [], // 接口返回的所有商品含分类
        cateList: [],  // 分类列表
        goodsList: [],  // 商品列表
        showSpec: false,
        selectSpecGoods: null,
        showDetail: false,
        selectDetail: null,
        order_info: {},
        isExpire: false,
        merchantSetting: {}, // 店铺信息
        mchntActivity: {
          coupon: {
            amt: 0
          },
          point: {
            exchange_pt: 0,
            goods_amt: 0,
            goods_name: '',
            obtain_amt: 0,
            obtain_limi: 0,
            status: 0
          },
          prepaid: {
            max_present_amt: 0,
            expired: 1
          }
        }, // 店铺活动
        showStoreDetail: false,
        typeScroller: null,
        menuScroller: null,
        orderScroller: null,
        hasOrder: false,  // 有无新订单
        ordersLoaded: false   // 加载完所有订单
      }
    },
    computed: {
      carts () {
        return this.$store.getters.getCarts
      }
    },
    created () {
      const menuList = {
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
      }
      this.$wechat.showMenuItems(menuList)
      this.isLoading = true
      this.mchnt_id = this.$route.params.mchnt_id
      let carts = JSON.parse(localStorage.getItem(`carts${this.mchnt_id}`))
      if (carts) {
        store.commit('GETCARTS', carts)
      }
      this.$http({
        url: Config.apiHost + 'diancan/c/goods_list',
        method: 'JSONP',
        params: {
          mchnt_id: this.mchnt_id,
          format: 'jsonp',
          open_id: sessionStorage.getItem('dc_openid') || '',
          sale_type: 3
        }
      }).then(function (response) {
        this.isLoading = false
        let data = response.data
        if (data.respcd === '4000') {   // 验证链接时间是否过期
          this.isExpire = true
          return
        } else if (data.respcd !== Config.code.OK) {
          this.$toast(data.respmsg)
          return
        }
        let mSet = data.data.merchant_setting
        this.fetchMchntActivity(mSet.en_mchnt_id)
        sessionStorage.setItem('isDadaDeliver', mSet.distribution)
        // 配送费
        let deliver = this.$parent.deliver
        if (mSet.distribution === 0) {
          deliver.shipping_fee = mSet.shipping_fee
          deliver.min_shipping_fee = mSet.min_shipping_fee
        }
        deliver.start_delivery_fee = mSet.start_delivery_fee
        sessionStorage.setItem(`deliver${this.mchnt_id}`, JSON.stringify(deliver))
        this.$emit('updateDeliver', deliver)
        this.shopbg = data.data.head_img
        this.merchantSetting = mSet
        let goods = data.data.goods
        goods.map(cate => {
          // 分类列表 计数
          this.cateList.push({
            name: cate.cate,
            cate_id: cate.cate_id,
            cate_count: 0
          })
          // single 无属性无规格商品，直接count计数
          cate.goods_list.map((goods) => {
            if (goods.spec_list.length === 1) {
              goods.count = 0
            }
          })
        })
        this.allGoods = goods
        this.goodsList = (function () {
          if (goods.length !== 0) {
            return goods[0].goods_list
          } else {
            return ''
          }
        })()
        // localStorage 购物车 商品数量同步
        this.mergeCartsCount()
        // 订单信息
        this.order_info = data.data.order_info
        let orderid = data.data.order_info.order_id || false
        this.hasOrder = orderid && orderid !== localStorage.getItem('order_id')
        // 刷新 BScroll 组件
        this.$nextTick(() => {
          let locationbarHeight = document.getElementsByClassName('location-bar')[0].offsetHeight
          let storebarHeight = document.getElementsByClassName('store-info')[0].offsetHeight
          document.getElementsByClassName('list-group')[0].style.height = window.innerHeight - locationbarHeight - storebarHeight + 'px'
          document.getElementsByClassName('shopmenu-list')[0].style.height = window.innerHeight - locationbarHeight - storebarHeight + 'px'
          this.typeScroller = new BScroll(this.$refs.group, {
            startX: 0,
            startY: 0,
            click: true
          })
          this.menuScroller = new BScroll(this.$refs.menu, {
            startX: 0,
            startY: 0,
            click: true
          })
        })
        // 微信朋友圈、微信好友 分享
        const shopname = data.data.merchant_setting.shop_name
        const logourl = data.data.merchant_setting.logo_url
        Util.setTitle(shopname)
        this.shareStore(shopname, logourl)
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$wechat.hideOptionMenu()
      localStorage.setItem(`carts${this.mchnt_id}`, JSON.stringify(this.carts))
      next()
    },
    methods: {
      hasNumber (goods) {
        let count = 0
        this.carts.map((value) => {
          if (value.unionid === goods.unionid) {
            count += value.count
          }
        })
        return count
      },
      updateOrdersLoaded () {
        this.$nextTick(() => {
          this.ordersLoaded = true
          let storebarHeight = document.getElementsByClassName('store-info')[0].offsetHeight
          document.getElementsByClassName('order-wrapper')[0].style.height = window.innerHeight - storebarHeight + 'px'
          this.orderScroller = new BScroll(this.$refs.order, {
            startX: 0,
            startY: 0,
            click: true
          })
        })
      },
      toggleTab (content) {
        this.showOrderList = content === 'order'
        if (content === 'order' && this.firstLoadOrders) {
          this.$refs.orderlist.getDataForMerchant()
          this.hasOrder = false
          localStorage.setItem('order_id', this.order_info.order_id || '')
          this.firstLoadOrders = false
        }
      },
      fetchMchntActivity (hashid) {
        this.$http({
          url: Config.mHost + 'v1/mkw/activity_tip',
          method: 'JSONP',
          params: {
            enuserid: hashid,
            format: 'jsonp'
          }
        }).then(function (response) {
          let data = response.data
          let prepaid = response.data.data.prepaid
          this.mchntActivity = data.data
          let arg = [this.mchntActivity.coupon, this.mchntActivity.point, this.mchntActivity.prepaid]
          this.$refs.getStore.checkAtvNumber(arg)
          sessionStorage.setItem('prepaid', JSON.stringify({
            balance: prepaid.balance || 0,
            max_present_amt: prepaid.max_present_amt,
            expired: prepaid.expired,
            recharge_url: prepaid.recharge_url
          }))
        })
      },
      mergeCartsCount () {
        this.carts.map(cgoods => {
          this.cateList.map(cate => {
            if (cate.cate_id === cgoods.cate_id) {
              cate.cate_count += cgoods.count
            }
          })

          this.allGoods.map((cate) => {
            if (cate.cate_id === cgoods.cate_id) {
              cate.goods_list.map((goods) => {
                if (cgoods.type === 'single' && goods.unionid === cgoods.unionid) {
                  goods.count = cgoods.count
                }
              })
            }
          })
        })
      },
      goOrderList () {
        let path = Config.env === 'development' ? '' : '/dc'
        window.location.href = `${window.location.origin}${path}/order-list.html?#/merchant/${this.mchnt_id}`
      },
      goDetail () {
        this.$router.push({
          name: 'orderDetail',
          params: {
            mchnt_id: this.mchnt_id,
            order_id: this.order_info.order_id
          }
        })
      },
      changeCartSingle (goods, count) {
        let cartIndex = this.carts.findIndex((g) => {
          return g.unionid === goods.unionid
        })
        if (cartIndex < 0) {
          let cartGoods = {
            name: goods.name,
            cate_id: goods.cate_id,
            unionid: goods.unionid,
            count: 1,
            spec: goods.spec_list[0],
            type: 'single'
          }
          store.commit('ADDCARTS', cartGoods) // 新增
        } else {
          if (count === 0) {
            store.commit('DELCARTS', cartIndex) // 移除
          } else {
            store.commit('UPDATECARTCOUNT', { // +1
              index: cartIndex,
              count
            })
          }
        }
        localStorage.setItem(`carts${this.mchnt_id}`, JSON.stringify(this.carts))
      },
      updateGoodsCount (cateid, unionid, count, type) {
        let cateIndex = this.cateList.findIndex((cate) => {
          return cate.cate_id === cateid
        })
        this.updateCatesCount(cateid, count, type)

        let updateIndex = this.allGoods[cateIndex].goods_list.findIndex((goods) => {
          return goods.unionid === unionid
        })

        this.allGoods[cateIndex].goods_list[updateIndex].count = count
      },
      updateCatesCount (cateid, count, type) {
        let cateIndex = this.cateList.findIndex((cate) => {
          return cate.cate_id === cateid
        })
        let catecount = this.cateList[cateIndex].cate_count
        if (type === 'plus') {
          this.cateList[cateIndex].cate_count = catecount + 1
          _hmt.push(['_trackEvent', 'view-merchant', 'click-plusBtn'])
        } else if (type === 'minus') {
          if (catecount === 0) return
          this.cateList[cateIndex].cate_count = catecount - 1
          _hmt.push(['_trackEvent', 'view-merchant', 'click-minusBtn'])
        } else if (type === 'diy') {
          this.cateList[cateIndex].cate_count = count
          _hmt.push(['_trackEvent', 'view-merchant', 'click-diyBtn'])
        }
      },
      cleanCatesGoodsCount () {
        this.cateList.map((cate) => {
          cate.cate_count = 0
        })
        this.allGoods.map((cate) => {
          cate.goods_list.map((goods) => {
            goods.count = 0
          })
        })
      },
      cateSelect (index) {
        this.selectIndex = index
        this.goodsList = this.allGoods[index].goods_list
        this.$nextTick(function () {
          this.typeScroller.refresh()
          this.menuScroller.refresh()
        })
      },
      hasSelect (goods) {
        return !!goods.spec_list.find(spec => spec._count)
      },
      showSpecHandler (goods) {
        this.selectSpecGoods = goods
        // 移动端滚动穿透问题
        document.querySelector('body').classList.add('popup-open')
        this.showSpec = true
      },
      hideSpecHandler () {
        document.querySelector('body').classList.remove('popup-open')
        this.showSpec = false
      },
      showDetailHandler (goods) {
        this.selectDetail = goods
        this.showDetail = true
      },
      hideDetailHandler () {
        this.showDetail = false
      },
      shareStore (shopname, logourl) {
        let shareLink = Config.rootHost + 'take-out.html?/#!/merchant/' + this.mchnt_id
        let imgUrl = logourl || 'http://near.m1img.com/op_upload/8/14944084019.jpg'
        Promise.all([this.$wechat.init(), this.$wechat.ready()]).then(() => {
          this.$wechat.menuShareAppMessage({
            title: `我在${shopname}叫了外卖，美食当然要和你一起分享！`,
            desc: '菜单在眼前，吃啥不纠结！',
            imgUrl: imgUrl,
            link: shareLink
          })
          this.$wechat.menuShareTimeline({
            title: `我在${shopname}叫了外卖，好吃到发朋友圈！快来看看~`,
            imgUrl: imgUrl,
            link: shareLink
          })
          this.$wechat.getOverdistFormattedAddress()
        })
      },
      showStoreDetailHandler () {
        this.showStoreDetail = true
        document.querySelector('body').classList.add('popup-open')
      },
      hideStoreDetailHandler () {
        this.showStoreDetail = false
        document.querySelector('body').classList.remove('popup-open')
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/main.scss";
  .c-loading-container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    z-index: 1000;
  }
  .order-info {
    position: relative;
    z-index: 100;
    background-color: #FFEAD1;
    padding: 20px;
    display: flex;
    align-items: center;
    p {
      font-size: 30px;
      color: #2F323A;
      flex: 1;
    }
    button {
      display: block;
    }
  }

  .tabbar {
    padding: 0 15%;
    font-size: 32px;
    border-bottom: 2px solid #E5E5E5;
    span {
      width: 50%;
      display: inline-block;
      text-align: center;
      height: 90px;
      line-height: 90px;
      color: #606470;
      &.active {
        color: #ff8100;
        border-bottom: 4px solid #ff8100;
      }
      &.hasorder {
        position: relative;
      }
      &.hasorder:after {
        position: absolute;
        content: '';
        width: 12px;
        height: 12px;
        border-radius: 100%;
        display: inline-block;
        background-color: #FF2400;
        top: 50%;
        margin-top: -26px;
      }
    }
  }
  .order-wrapper {
    overflow: scroll;
  }
  .order-wrapper::-webkit-scrollbar { // 隐藏滚动条
    display: none;
  }

  /*左侧分类列表*/
  .list-group-box {
    width: 156px;
    background-color: #F7F7F7;
  }

  .list-group {
    overflow: scroll;
    li {
      position: relative;
      text-align: center;
      padding: 30px 12px;
      font-size: 28px;
      color: #2F323A;
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
  .list-group::-webkit-scrollbar { // 隐藏滚动条
    display: none;
  }

  /*右侧选菜列表*/
  .shopmenu-list-container {
    height: 100%;
    background-color: #fff;
  }

  .shopmenu-list {
    overflow: hidden;
  }

  // 购物车遮挡
  .list-group ul{
    padding-bottom: 104px;
    .speceBottom {
      height: 38px;
    }
  }
  .shopmenu-list ul {
    padding-bottom: 180px;
  }

  li.list-item {
    position: relative;
    padding-left: 24px;
    .wrap {
      position: relative;
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
        font-weight: normal;
        color: #4d4d4d;
        font-size: 32px;
        padding-right: 24px;
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

  .totop1-transition {
    transition: all .3s ease;
  }

  .totop1-enter, .totop1-leave {
    transform: translateY(100%);
    /*opacity: 0;*/
  }

  .spec-btn {
    width: 196px;
    height: 100px;
    span {
      display: inline-block;
      padding: 0 28px;
      background-color: #FF8100;
      height: 52px;
      line-height: 54px;
      border-radius: 30px;
      font-size: 24px;
      color: #fff;
    }
    .goods-select-number {
      position: absolute;
      top: 6px;
      right: 8px;
      width: 32px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      color: #fff;
      border-radius: 50%;
      background-color: #FD5359;
    }
  }
</style>

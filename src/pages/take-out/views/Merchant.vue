<template>
  <div>
    <get-Location></get-Location>
    <div class="c-loading-container" v-if="isLoading">
      <loading :visible="isLoading"></loading>
    </div>
    <div class="order-info" v-if="isEmptyOrder">
      <p>你在 {{order_info.order_time | formatTime('hh:mm')}} 提交了一个订单</p>
      <button class="default-button" type="button" @click="goDetail">查看订单</button>
    </div>
    <div id="c-restaurant-content-box" class="l-r">
      <div class="list-group-box">
        <div class="list-group" ref="group">
          <ul class="">
            <li v-for="(group, index) in groupList" :class="{'active': selectIndex === index}" @click="groupSelect(index, group)">
              <div>
                {{group.cate}}<span class="count" v-show="group._count">{{group._count  > 9 ? '...' : group._count}}</span>
              </div>
            </li>
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
              <div v-else class="l-c-c goods-select-container spec-btn" :class="{'select': hasSelect(goods)}">
                <button @click.stop="showSpecHandler(goods)">{{hasSelect(goods) ? '重选规格' : '选择规格' }}</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--选择规格-->
    <select-spec :visible.sync="showSpec"
                 :goods="selectSpecGoods"
                 :plus="plusHandler"
                 :minus="minusHandler"
                 :diy="diyHandler"
                 @hideSpecHandler="hideSpecHandler"
                 @selectSpecBtn="selectSpecBtn">
    </select-spec>

    <goods-detail :visible="showDetail"
                  @hideDetailHandler="hideDetailHandler"
                  :goods="selectDetail"></goods-detail>

    <!--购物车-->
    <cart-bar v-show="cart.length"
      :cart="cart" :plus="plusHandler" :minus="minusHandler" :diy="diyHandler"
      :overtime="merchantSetting.overtime"
      :deliver="deliver" :nodelivery="merchantSetting.delivery_open_state === 0"
      @cleanGoods="cleanGoods">
    </cart-bar>

    <!--扫描二维码蒙层-->
    <scan-qrcode :display="isExpire"></scan-qrcode>
  </div>
</template>

<script type="text/ecmascript-6">
  /* global _hmt */
  import Util from '../../../methods/Util'
  import Loading from '../../../components/loading/Loading'
  import GoodsSelect from '../../../components/GoodsSelect'
  import SelectSpec from '../../../components/SelectSpec'
  import CartBar from '../components/CartBar'
  import GoodsDetail from '../../../components/GoodsDetail'
  import ScanQrcode from '../../../components/ScanQrcode.vue'
  import GetLocation from '../../../components/GetLocation.vue'
  import Config from '../../../methods/Config'
  import BScroll from 'better-scroll'

  const STORAGEKEY = 'LIST-VIEW-goods_list'

  export default {
    props: ['cart', 'deliver'],
    components: {
      Loading, CartBar, GoodsSelect, SelectSpec, GoodsDetail, ScanQrcode, GetLocation
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
        merchantSetting: {},
        typeScroller: null,
        menuScroller: null
      }
    },
    computed: {
      isEmptyOrder () {
        return !Util.isEmptyObject(this.order_info)
      }
    },
    created () {
      this.isLoading = true
      this.mchnt_id = this.$route.params.mchnt_id || window.sessionStorage.getItem('mchntId')
      let args = {
        mchnt_id: this.mchnt_id,
        format: 'jsonp',
        open_id: window.localStorage.getItem('dc_openid') || '',
        sale_type: 3
      }
      this.$http({
        url: Config.apiHost + 'diancan/c/goods_list',
        method: 'JSONP',
        params: args
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
        sessionStorage.setItem('isDadaDeliver', mSet.distribution)
        // 配送费
        let deliver = this.$parent.deliver
        if (mSet.distribution === 0) {
          deliver.shipping_fee = mSet.shipping_fee
          deliver.min_shipping_fee = mSet.min_shipping_fee
        }
        deliver.start_delivery_fee = mSet.start_delivery_fee
        this.$emit('updateDeliver', deliver)
        // 商品购物车
        this.merchantSetting = mSet
        this.setStorage(data.data)
        this.$emit('getCart', this.mchnt_id)
        let goods = this.mergeGoods(data.data.goods)
        this.groupList = goods
        this.goodsList = (function () {
          if (goods.length !== 0) {
            return goods[0].goods_list
          } else {
            return ''
          }
        })()
        this.order_info = data.data.order_info
        this.$nextTick(() => {
          let topbarHeight = document.getElementsByTagName('header')[0].offsetHeight
          document.getElementsByClassName('list-group')[0].style.height = window.innerHeight - topbarHeight + 'px'
          document.getElementsByClassName('shopmenu-list')[0].style.height = window.innerHeight - topbarHeight + 'px'
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
        const shopname = data.data.shopname
        const logourl = data.data.logo_url
        Util.setTitle(shopname)
        this.shareStore(shopname, logourl)
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$wechat.hideOptionMenu()
      next()
    },
    methods: {
      goDetail () {
        this.$router.push({
          name: 'orderDetail',
          params: {
            mchnt_id: this.mchnt_id,
            order_id: this.order_info.order_id
          }
        })
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
        delArr.length && this.$emit('toast', delArr.join(' ') + '已下架')
        delCart.reverse().forEach(item => {
          cart.splice(item, 1)
        })
        this.$emit('saveCartEv', this.mchnt_id, cart)
        return goods
      },
      groupSelect (index, item) {
        this.selectIndex = index
        this.goodsList = item.goods_list
        this.$nextTick(function () {
          this.typeScroller.refresh()
          this.menuScroller.refresh()
        })
      },
      plusHandler (goods, specIndex) {
        this.addCartHandler(goods, specIndex, true)
        _hmt.push(['_trackEvent', 'view-merchant', 'click-plusBtn'])
      },
      minusHandler (goods, specIndex) {
        this.addCartHandler(goods, specIndex, false)
        _hmt.push(['_trackEvent', 'view-merchant', 'click-minusBtn'])
      },
      diyHandler (goods, specIndex, number) {
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

        this.$emit('changeCart', newGoods, specIndex, this.mchnt_id)

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
        this.$refs.spec.showSpec()
      },
      hideSpecHandler () {
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
      },
      selectSpecBtn (goods, specIndex) {
        this.goodsList.find(g => g.unionid === goods.unionid)._lastSpec = specIndex
      },
      cleanGoods (mchntId) {
        let data = this.getStorage() || {}
        let goods = data.goods || []
        goods.map(group => {
          return group.goods_list.map(goods => {
            goods._lastSpec = 0
            return goods
          })
        })

        this.groupList = goods
        this.goodsList = goods[this.selectIndex].goods_list
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
    z-index: 999;
  }
  .order-info {
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

  /*左侧分类列表*/
  .list-group-box {
    width: 156px;
    background-color: #F7F7F7;
  }

  .list-group {
    overflow: hidden;
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
  }

  .shopmenu-list {
    overflow: hidden;
  }

  // 购物车遮挡
  .list-group ul{
    padding-bottom: 104px;
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

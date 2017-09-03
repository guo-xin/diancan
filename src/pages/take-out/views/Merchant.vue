<template>
  <div>
    <get-Location></get-Location>
    <div class="order-info" v-if="isEmptyOrder">
      <p>你在 {{order_info.order_time | formatTime('hh:mm')}} 提交了一个订单</p>
      <button class="default-button" type="button" @click="goDetail">查看订单</button>
    </div>
    <div id="c-restaurant-content-box" class="l-r">
      <div class="list-group-box">
        <div class="list-group" ref="group">
          <ul>
            <li v-for="(cate, index) in cateList" :class="{'active': selectIndex === index}"
                @click="cateSelect(index, cate)">
              <div>
                {{cate.name}}<span class="count" v-show="cate.cate_count">{{cate.cate_count  > 9 ? '...' : cate.cate_count}}</span>
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
                  <h4 class="title" @click.stop="showDetailHandler(goods)">{{goods.name}}</h4>
                  <p class="old-price text-line-through" v-if="goods.spec_list[0].orgtxamt && goods.spec_list[0].orgtxamt !== goods.spec_list[0].txamt">¥&nbsp;{{goods.spec_list[0].orgtxamt | formatCurrency}}</p>
                  <p v-else class="old-price"></p>
                  <p class="price"><em class="dollar">¥&nbsp;</em>{{goods.spec_list[0].txamt | formatCurrency}}</p>
                </div>
              </div>
              <!-- 商品+-选择 -->
              <goods-select v-if="goods.spec_list.length === 1" class="goods-select-container"
                            :goods="goods"
                            :count="goods.count"
                            @updateGoodsCount="updateGoodsCount"
                            @changeCart="changeCartSingle">
              </goods-select>

              <div v-else class="l-c-c goods-select-container spec-btn">
                <span @click.stop="showSpecHandler(goods)">{{hasSelect(goods) ? '重选规格' : '选择规格' }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--选择规格-->
    <select-spec :visible="showSpec"
                 :goods="selectSpecGoods"
                 :updateGoodsCount="updateGoodsCount"
                 @hideSpecHandler="hideSpecHandler">
    </select-spec>

    <goods-detail :visible="showDetail"
                  @hideDetailHandler="hideDetailHandler"
                  :goods="selectDetail"></goods-detail>

    <!-- 购物车 -->
    <cart-bar :updateGoodsCount="updateGoodsCount"
              :overtime="merchantSetting.overtime"
              :nodelivery="merchantSetting.delivery_open_state === 0"  
              :deliver="deliver"></cart-bar>

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
  import Config from 'methods/Config'
  import BScroll from 'better-scroll'
  import store from '../../../vuex/store'

  export default {
    props: ['deliver'],
    components: {
      Loading, CartBar, GoodsSelect, SelectSpec, GoodsDetail, ScanQrcode, GetLocation
    },
    data () {
      return {
        isLoading: false,
        mchnt_id: '',   // 商户id
        selectIndex: 0, // 激活分类
        allGoods: [], // 接口返回的所有商品含分类
        cateList: [],  // 分类列表
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
      carts () {
        return this.$store.getters.getCarts
      },
      isEmptyOrder () {
        return !Util.isEmptyObject(this.order_info)
      }
    },
    created () {
      this.isLoading = true
      let args = {
        mchnt_id: this.$route.params.mchnt_id,
        format: 'jsonp',
        open_id: sessionStorage.getItem('dc_openid') || '',
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
        // this.setStorage(data.data)
        // this.$emit('getCart', this.mchnt_id)
        // let goods = this.mergeGoods(data.data.goods)
        let goods = data.data.goods
        goods.map(cate => {
          // 分类列表 计数
          this.cateList.push({
            name: cate.cate,
            cate_id: cate.cate_id,
            cate_count: 0
          })
          // specAttrsCount对象 用来给不同规格+属性 组合的商品 计数
          cate.goods_list.map((goods) => {
            goods.specAttrsCount = {}
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
        console.log(this.allGoods)
        console.log(this.goodsList)
        this.order_info = data.data.order_info
        // 刷新 BScroll 组件
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
      changeCartSingle (goods, count) {
        console.log(this.carts)
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
            this.carts.splice(cartIndex, 1) // 移除
          } else {
            store.commit('UPDATECARTCOUNT', { // +1
              index: cartIndex,
              count
            })
          }
        }
      },
      updateGoodsCount (cateid, unionid, selectedSpecAttr, count, type) {
        let cateIndex = this.cateList.findIndex((cate) => {
          return cate.cate_id === cateid
        })
        this.updateCatesCount(cateIndex, count, type)

        let updateIndex = this.allGoods[cateIndex].goods_list.findIndex((goods) => {
          return goods.unionid === unionid
        })

        if (!selectedSpecAttr) {
          this.allGoods[cateIndex].goods_list[updateIndex].count = count
        } else {
          this.$set(this.allGoods[cateIndex].goods_list[updateIndex].specAttrsCount, selectedSpecAttr, count)
        }
      },
      updateCatesCount (cateIndex, count, type) {
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
        console.log(goods)
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
      height: 60px;
      line-height: 60px;
      border-radius: 30px;
      font-size: 24px;
      color: #fff;
    }
  }
</style>

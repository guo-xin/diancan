<template>
  <header class="store-info" @click="showStoreDetail()" :style="backgroundObj()">
    <div class="inner">
      <h1>{{merchantSetting.shop_name}}</h1>
      <div class="ul-content">
        <ul :class="ulView">
          <li v-if="!(mchntActivity.prepaid.expired || isNaN(mchntActivity.prepaid.max_present_amt))">
            <i class="icon-wallet"></i><span>储值最高送{{mchntActivity.prepaid.max_present_amt | formatCurrency | noZeroCurrency}}元~</span>
          </li>
          <li v-if="mchntActivity.coupon.amt" class="coupon-view"><i class="icon-coupon"></i><span>消费满{{ mchntActivity.coupon.amt | formatCurrency | noZeroCurrency }}元领红包~</span></li>
          <li v-if="mchntActivity.point.obtain_amt && (mchntActivity.point.status === 1 || mchntActivity.point.status === 2)"><i class="icon-star"></i><span>消费满{{ mchntActivity.point.obtain_amt | formatCurrency | noZeroCurrency }}元可集点~</span></li>
          <li v-if="!(mchntActivity.prepaid.expired || isNaN(mchntActivity.prepaid.max_present_amt))">
            <i class="icon-wallet"></i><span>储值最高送{{mchntActivity.prepaid.max_present_amt | formatCurrency | noZeroCurrency}}元~</span>
          </li>
          <li v-if="mchntActivity.coupon.amt" class="coupon-view"><i class="icon-coupon"></i><span>消费满{{ mchntActivity.coupon.amt | formatCurrency | noZeroCurrency }}元领红包~</span></li>
          <li v-if="mchntActivity.point.obtain_amt && mchntActivity.point.status === 1"><i class="icon-star"></i><span>消费满{{ mchntActivity.point.obtain_amt | formatCurrency | noZeroCurrency }}元可集点~</span></li>
        </ul>
      </div>
      <i class="icon-right-arrow"></i>
    </div>
  </header>
</template>

<script type="text/ecmascript-6">
  import shopbg from '../assets/shop_bg.png'
  export default {
    props: ['merchantSetting', 'mchntActivity'],
    data () {
      return {
        btnDisabled: false,
        ulView: 'defaultUlView',
        activity: {}
      }
    },
    created () {
    },
    methods: {
      backgroundObj () {
        let bg = this.merchantSetting.head_img ? this.merchantSetting.head_img : shopbg
        return {
          backgroundImage: 'url(' + bg + ')',
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      },
      showStoreDetail () {
        this.$emit('showStoreDetailHandler')
      },
      checkAtvNumber (arg) {
        let count = 0
        arg.map(function (value) {
          if (JSON.stringify(value) !== '{}') {
            count++
          }
        })
        if (arg[1].status !== 1) {
          count--
        }
        if (arg[2].expired) {
          count--
        }
        if (count === 0 || count === 1) {
          this.ulView = 'defaultUlView'
        } else if (count === 2) {
          this.ulView = 'twoAtv'
        } else if (count === 3) {
          this.ulView = 'threeAtv'
        }
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/base/_var";
  .store-info {
    position: relative;
    z-index: 100;
    color: #fff;
    h1 {
      margin: 0;
      font-weight: normal;
      font-size: 32px;
    }
    .ul-content {
      margin-top: 20px;
      height: 40px;
      overflow: hidden;
    }
    ul {
      font-size: 28px;
      // animation: anim1 15s linear infinite normal;
      li {
        height: 40px;
        line-height: 40px;
      }
      i, span {
        vertical-align: middle;
      }
    }
    .icon-wallet {
      color: $orange;
      margin-right: 16px;
    }
    .coupon-view {
      text-indent: 4px;
    }
    .icon-coupon {
      color: #FF3D1F;
      margin-right: 22px;
    }
    .icon-star {
      color: #8883F4;
      margin-right: 20px;
    }
    .icon-right-arrow {
      font-size: 30px;
      position: absolute;
      right: 30px;
      top: 50%;
      margin-top: -15px;
    }
    .inner {
      padding: 50px 30px 55px;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
  .defaultUlView {
    animation: none;
  }
  .twoAtv {
    animation: anim1 6s linear infinite normal;
  }
  .threeAtv {
    animation: anim2 9s linear infinite normal;
  }
  // 活动滚动动画 3个活动
  @keyframes anim1 {
    0%{
      transform:translateY(0px);
    }
    45.8%{
      transform:translateY(0px);
    }
    50%{
      transform:translateY(-40px);
    }
    96%{
      transform:translateY(-40px);
    }
    100%{
      transform:translateY(-80px);
    }
  }
  @-webkit-keyframes anim1 {
    0%{
      transform:translateY(0px);
    }
    45.8%{
      transform:translateY(0px);
    }
    50%{
      transform:translateY(-40px);
    }
    96%{
      transform:translateY(-40px);
    }
    100%{
      transform:translateY(-80px);
    }
  }
  @keyframes anim2 {
    0%{
      transform:translateY(0px);
    }
    30%{
      transform:translateY(0px);
    }
    32.75%{
      transform:translateY(-40px);
    }
    65%{
      transform:translateY(-40px);
    }
    67.5%{
      transform:translateY(-80px);
    }
    97.25%{
      transform:translateY(-80px);
    }
    100%{
      transform:translateY(-120px);
    }
  }
  @-webkit-keyframes anim2 {
    0%{
      transform:translateY(0px);
    }
    30%{
      transform:translateY(0px);
    }
    32.75%{
      transform:translateY(-40px);
    }
    65%{
      transform:translateY(-40px);
    }
    67.5%{
      transform:translateY(-80px);
    }
    97.25%{
      transform:translateY(-80px);
    }
    100%{
      transform:translateY(-120px);
    }
  }
</style>

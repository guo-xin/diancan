<template>
  <header class="store-info" @click="showStoreDetail()" :style="backgroundObj()">
    <div class="inner">
      <h1>{{merchantSetting.shop_name}}</h1>
      <ul class="ulView">
        <marquee direction="up" truespeed="truespeed" height="18px" scrolldelay="500" behavior="scroll">
          <li :class="{'hide': (mchntActivity.prepaid.expired || isNaN(mchntActivity.prepaid.max_present_amt))}">
            <i class="icon-wallet"></i><span>储值最高送{{mchntActivity.prepaid.max_present_amt | formatCurrency | noZeroCurrency}}元~</span>
          </li>
          <li v-if="mchntActivity.coupon.amt" class="coupon-view"><i class="icon-coupon"></i><span>消费满¥{{ mchntActivity.coupon.amt | formatCurrency | noZeroCurrency }}领红包~</span></li>
          <li v-if="mchntActivity.point.obtain_amt"><i class="icon-star"></i><span>消费满¥{{ mchntActivity.point.obtain_amt | formatCurrency | noZeroCurrency }}可集点~</span></li>
        </marquee>
      </ul>
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
        btnDisabled: false
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
    ul {
      padding-top: 20px;
      font-size: 28px;
      height: 35px;
      overflow: scroll;
      li.hide {
        visibility: hidden;
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
      padding: 50px 30px 60px;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
</style>

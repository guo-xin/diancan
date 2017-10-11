<template>
  <div class="store-popup" v-if="visible" @click="hideStoreDetail($event)">
    <div class="inner">
      <figure class="bg" :style="backgroundObj()">
        <img v-if="merchantSetting.logo_url" :src="merchantSetting.logo_url" class="logo">
        <img v-else src="../assets/shop_logo.png" class="logo">
      </figure>
      <header>
        <div>
          <h1>{{merchantSetting.shop_name}}</h1>
          <p><i></i>{{merchantSetting.address}}</p>
        </div>
        <a :href="'tel:' + merchantSetting.mobile"><i class="icon-phone"></i></a>
      </header>
      <div class="delivery">
        <p v-if="merchantSetting.start_time">配送时间：{{merchantSetting.start_time}}-{{merchantSetting.end_time}}</p>
        <p v-if="merchantSetting.max_shipping_dist">配送范围：{{merchantSetting.max_shipping_dist / 1000}}km 内</p>
        <p v-if="merchantSetting.max_shipping_dist === 0 && merchantSetting.sale_type === 3">配送范围：不限制配送范围</p>
      </div>
      <ul class="activity-list">
        <li :class="{'hide': (mchntActivity.prepaid || isNaN(mchntActivity.prepaid.max_present_amt))}">
          <i class="icon-wallet"></i><span>储值最高送{{mchntActivity.prepaid.max_present_amt | formatCurrency | noZeroCurrency}}元</span>
          <button type="button" class="secondary-button small-button" style="display:none;" @click="goChuzhi()">储值</button>
        </li>
        <li class="hide"><i class="icon-coupon"></i><span>消费满¥20领红包</span></li>
        <li class="hide"><i class="icon-star"></i><span>消费满¥10可集点</span></li>
      </ul>
      <i class="icon-closed"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import shopbg from '../assets/shop_bg.png'
  export default {
    props: ['merchantSetting', 'mchntActivity', 'visible'],
    data () {
      return {
        btnDisabled: false
      }
    },
    created () {
    },
    methods: {
      goChuzhi () {
        let redirectUrl = window.location.href
        window.location.assign(`${this.mchntActivity.prepaid.recharge_url}&src=diancan&cback=${redirectUrl}`)
      },
      backgroundObj () {
        let bg = this.merchantSetting.head_img ? this.merchantSetting.head_img : shopbg
        return {
          backgroundImage: 'url(' + bg + ')',
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundColor: '#E5E5E5',
          backgroundRepeat: 'no-repeat'
        }
      },
      hideStoreDetail (e) {
        if (e.target.className === 'store-popup' || e.target.className === 'icon-closed') {
          this.$emit('hideStoreDetailHandler')
        }
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/base/_var";
  .store-popup {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    .inner {
      width: 90%;
      position: relative;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 10px;
    }
    p {
      padding: 0 30px;
    }
    figure {
      margin: 0;
      position: relative;
      width: 100%;
      height: 270px;
      border-radius: 10px 10px 0 0;
      .logo {
        position: absolute;
        bottom: -54px;
        left: 50%;
        margin-left: -54px;
        width: 108px;
        height: 108px;
        box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
        border-radius: 100%;
      }
    }
    .icon-closed {
      color: #fff;
      position: absolute;
      bottom: -1.6rem;
      left: 50%;
      margin-left: -0.3rem;
      font-size: 0.6rem;
    }
  }
  header {
    margin-top: 72px;
    position: relative;
    padding-right: 110px;
    padding-left: 30px;
    min-height: 70px;
    h1 {
      font-size: 32px;
      font-weight: normal;
      margin: 0 0 10px;
    }
    p {
      font-size: 24px;
      padding-left: 32px;
      padding-right: 30px;
      line-height: 1.5;
      background-image: url('../assets/marker.svg');
      background-repeat: no-repeat;
      background-position: 0 5px;
      background-size: 24px 24px;
      margin-bottom: 20px;
    }
    .icon-phone {
      position: absolute;
      right: 30px;
      top: 0;
      width: 70px;
      height: 70px;
      line-height: 70px;
      border-radius: 100%;
      text-align: center;
      color: $orange;
      font-size: 48px;
      border: 2px solid #FFC080;
    }
  }
  .delivery {
    font-size: 24px;
    color: $aluminium;
    line-height: 1.5;
    font-size: 24px;
  }
  .activity-list {
    margin: 20px 30px 0;
    padding-top: 30px;
    padding-bottom: 20px;
    border-top: 2px solid $lightGray;
    font-size: 28px;
    line-height: 2.4;
    li.hide {
      visibility: hidden;
    }
    button {
      float: right;
    }
    i {
      display: inline-block;
      width: 36px;
      height: 36px;
      color: #fff;
      border-radius: 100%;
      line-height: 38px;
      text-align: center;
      margin-right: 16px;
      font-size: 20px;
    }
    .icon-wallet {
      background-color: $orange;
    }
    .icon-coupon {
      background-color: $red;
    }
    .icon-star {
      background-color: $purple;
    }
  }
</style>

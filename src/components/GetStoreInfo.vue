<template>
  <header class="store-info" @click="showStoreDetail()" :style="backgroundObj()">
    <div class="inner">
      <h1>{{merchantSetting.shop_name}}</h1>
      <ul>
        <li :class="{'hide': mchntActivity.prepaid.expired}">
          <i class="icon-wallet"></i><span>储值最高送{{mchntActivity.prepaid.max_present_amt | formatCurrency | noZeroCurrency}}元</span>
        </li>
      </ul>
      <i class="icon-right-arrow"></i>
    </div>
  </header>
</template>

<script type="text/ecmascript-6">
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
        return {
          backgroundImage: 'url(' + this.merchantSetting.head_img + ')',
          backgroundSize: '100%',
          backgroundPosition: 'center'
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
    z-index: 99;
    color: #fff;
    h1 {
      margin: 0;
      font-weight: normal;
      font-size: 32px;
    }
    ul {
      padding-top: 20px;
      font-size: 28px;
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
    .icon-right-arrow {
      font-size: 30px;
      position: absolute;
      right: 30px;
      top: 50%;
      margin-top: -15px;
    }
    .inner {
      padding: 40px 30px 60px;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
</style>

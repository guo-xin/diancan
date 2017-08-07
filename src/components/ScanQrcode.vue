<template>
  <div v-show="display" class="go-scan">
    <div class="head">
      <p>对不起，我们还不清楚你坐在哪个位置</p>
      <p>请扫一扫桌上的二维码，开始点餐</p>
    </div>
    <a @click.prevent="scan" class="scan">扫描二维码</a>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .go-scan {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2000;
    background-color: #f7f7f7;
    .head {
      margin: 200px auto 60px;
      width: 630px;
      border: 4px solid #CBCCCB;
      border-radius: 16px;
      background-color: #fff;
      padding: 90px 0;
      position: relative;
      p {
        text-align: center;
        margin: 10px auto;
        font-size: 30px;
        color: #2F323A;
      }
      img {
        width: 134px;
        height: 134px;
        position: absolute;
        bottom: -6px;
        left: 224px;
      }
    }
    .scan {
      display: block;
      margin: 0 auto;
      width: 630px;
      height: 88px;
      line-height: 88px;
      background-color: #FE9B20;
      font-size: 40px;
      color: #fff;
      border-radius: 6px;
      text-align: center;
    }
  }
</style>
<script type="text/ecmascript-6">
  export default {
    props: ['display'],
    methods: {
      scan () {
        this.$wechat.scanQRcode()
      }
    }
  }
</script>

<template>
  <div v-if="display" class="go-scan">
    <div class="head">
      <p>对不起，我们还不清楚你坐在哪个位置</p>
      <p>请扫一扫桌上的二维码，开始点餐</p>
      <img src="../assets/bear.svg" alt="小熊">
    </div>
    <a @click.prenvet="scan" class="scan">扫描二维码</a>
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
      height: 320px;
      border: 4px solid #CBCCCB;
      border-radius: 16px;
      background-color: #fff;
      padding-top: 50px;
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
  /* global wx*/
  export default {
    props: ['display'],
    methods: {
      scan () {
        wx.scanQRCode({
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'] // 可以指定扫二维码还是一维码，默认二者都有
        })
      }
    }
  }
</script>

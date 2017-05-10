<template>
  <img @click="scan" src="assets/scan-qrcode.png" alt="扫码点餐">
</template>
<style lang="scss" type="scss" rel="stylesheet/scss">
  html, body {
    height: 100%;
  }
  body {
    margin: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
</style>
<script type="text/ecmascript-6">
  import Wechat from '../../methods/Wechat'
  export default {
    data () {
      return {
      }
    },
    ready () {

    },
    methods: {
      scan () {
        window.alert('scan')
        Wechat.onScanQRcode()
      }
    }
  }
</script>

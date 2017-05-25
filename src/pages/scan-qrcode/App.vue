<template>
  <div @click="scan"></div>
</template>
<style lang="scss" type="scss" rel="stylesheet/scss">
  html, body {
    height: 100%;
  }
  body {
    margin: 0;
  }
  div {
    width: 100%;
    height: 100%;
    background: url('assets/scan-qrcode.png') no-repeat;
    background-size: 100% 100%;
  }
</style>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
      }
    },
    methods: {
      scan () {
        this.$wechat.scanQRcode()
      }
    }
  }
</script>

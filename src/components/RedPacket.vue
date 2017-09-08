<template>
  <div class="red-packet-view">
    <section class="red-packet-div">
      <div class="red-packet-header">{{ headerTxt }}</div>
      <div class="red-packet-img"></div>
      <div class="red-packet-getbtn">{{ getBtnTxt }}</div>
      <div class="red-packet-sharebtn">{{ shareBtnTxt }}</div>
      <p class="attentionTxt">{{ attentionTxt }}</p>
    </section>
    <div class="mark"></div>
  </div>
  
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        headerTxt: '恭喜~老板送你一个红包~',
        getBtnTxt: '点击领取红包',
        shareBtnTxt: '分享给好友领取更多红包',
        attentionTxt: '关注"好近"公众账号，查看我的红包'
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">

// 遮罩
.mark {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
  
</style>

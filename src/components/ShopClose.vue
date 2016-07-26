<template>
  <div v-if="display" class="close">
    <div class="tip-pic"></div>
    <p class="tip">本店点餐系统开放时间</p>
    <p class="time">{{info.start_time}} - {{info.end_time}}</p>
    <p class="no">该时间段无需扫码，客官请移步取餐区点餐</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['display', 'info']
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .close{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #F7F7F7;
    padding: 1px 40px;
    color: #2F323A;
    text-align: center;
    .tip-pic{
      width: 350px;
      height: 410px;
      margin: 170px auto 0 auto;
      background: url("../assets/shopClose.png") no-repeat center center;
      background-size: 100% 100%;
    }
    .tip{
      margin-top: 46px;
      font-size: 30px;
    }
    .time{
      margin-top: 32px;
      font-size: 48px;
    }
    .no{
      margin-top: 38px;
      border-top: 2px solid #DEDEDE;
      font-size: 30px;
      padding-top: 30px;
    }
  }
</style>

<template>
  <div class="red-packet-view">
    <section class="red-packet-div">
      <div class="red-packet-header">{{ headerTxt }}</div>
      <div class="red-packet-img"><img src="../assets/Redpacket.png" alt=""></div>
      <div class="red-packet-getbtn" :class="{'activate': getBtnClicked}" @click="getPacket()" >{{ getBtnTxt }}</div>
      <div class="red-packet-sharebtn changeColor" v-show="shareShow" @click.stop="wxShara()">{{ shareBtnTxt }}</div>
    </section>
    <span class="closeView" @click.stop="closeView()"><i class="icon-closed"></i></span>
  </div>
</template>
<script type=" text/ecmascript-6">
  import WeChat from '../methods/wechat/index'
  export default {
    data () {
      return {
        headerTxt: '恭喜~老板送你一个红包~',
        getBtnTxt: '点击领取红包',
        shareBtnTxt: '分享给好友领取更多红包',
        shareShow: false,
        getBtnClicked: false
      }
    },
    methods: {
      getPacket () {
        this.shareShow = true
        this.getBtnClicked = true
        this.getBtnTxt = '已领取'
      },
      closeView () {
        this.$emit('hideRedPacketView')
      },
      wxShara () {
        WeChat.menuShareAppMessage({
          
        })
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .red-packet-view {
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    .red-packet-div {
      width: 86.6667%;
      padding-bottom: 72px;
      background-color: #fff;
      z-index: 2;
      margin: 100px auto 0;
      border-radius: 12px;
      background: linear-gradient(to top, #fff 60%, #ffecdf);
      overflow: hidden;
      .red-packet-header {
        width: 100%;
        font-size: 36px;
        text-align: center;
        margin-top: 90px;
        margin-bottom: 48px;
        font-family: PingFang SC-Medium;
        color: #4C3A3C;
      }
      .red-packet-img {
        width: 622px;
        margin: 0 auto;
        padding: 10px 0 14px 14px;
        img {
          width: 504px;
        }
      }
      .red-packet-getbtn {
        height: 80px;
        font-size: 32px;
        line-height: 80px;
        width: 510px;
        margin: 0 auto;
        text-align: center;
        font-family: PingFang SC;
        font-weight: 300;
        color: #fff;
        background-color: #F7503D;
        margin-top: 42px;
        border-radius: 5px;
        &.activate {
          background-color: #c2c2c2;
        }
      }
      .changeColor {
        height: 80px;
        font-size: 32px;
        line-height: 80px;
        width: 510px;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        background-color: #fd8124;
        margin-top: 30px;
        border-radius: 5px;
        font-family: PingFang SC-Regular;
        font-weight: 300;
      }
    }
    .closeView {
      display: block;
      width: 41px;
      height: 41px;
      font-size: 41px;
      color: #fff;
      margin: 82.6px auto 0 ;
    }
  }
  
</style>

<template>
  <div class="red-packet-view">
    <section class="red-packet-div">
      <div class="red-packet-header">{{ redPacketTitle }}</div>
      <div class="red-packet-img">
        <img class="RedPacketImg bounceOut" v-if="!openRedPacket" src="../assets/Redpacket.png" alt="">
        <div class="OpenRedView bounceOut" v-if="openRedPacket" >
          <img class="OpenRedPacketImg"  src="../assets/consumeBack.png" alt="">
          <span  v-show="openRedPacket" class="numberaa">¥&nbsp;<em>{{ redPacketNumber }}</em></span>
        </div>
      </div>
      <div class="red-packet-getbtn" :class="{'activate': getBtnClicked}" @click="getPacket()" >{{ getBtnTxt }}</div>
      <div class="red-packet-sharebtn changeColor" v-if="shareShow" @click.stop="wxShara()">{{ shareBtnTxt }}</div>
      <span class="closeView" @click.stop="closeView()"><i class="icon-closed"></i></span>
    </section>
    <!-- 提示分享遮罩 -->
    <div class="shareView" v-show="showShareView" @click.stop="closeShareView()">
      <div></div>
    </div>
  </div>
</template>
<script type=" text/ecmascript-6">
  import WeChat from '../methods/wechat/index'
  import filter from '../methods/Filters'
  export default {
    props: ['activity'],
    data () {
      return {
        getBtnTxt: '点击领取红包',
        shareBtnTxt: '分享给好友领取更多红包',
        redPacketTitle: '',
        shareShow: false,
        getBtnClicked: false,
        showShareView: false,
        openRedPacket: false,
        coupons: [],// 消费返红包数据
        page: {},
        share: {},// 消费分享红包数据
        redPacketNumber: ''// 红包数值
      }
    },
    created () {
      // console.log(this.activity)
      this.coupons = this.activity.coupons
      this.redPacketNumber = filter.formatCurrency(this.coupons[0].amt)
      this.page = this.activity.page
      this.share = this.activity.share
      // this.redPacketTitle = '红包来了'
      this.redPacketTitle = this.coupons[0].title
      // console.log(this.coupons)
      // console.log(this.page)
      // console.log(this.share)
    },
    methods: {
      getPacket () {
        this.getBtnClicked = true
        this.getBtnTxt = '已领取'
        this.openRedPacket = true
        // 判断红包类型
        this.isShare(this.share)
      },
      closeView () {
        this.$emit('hideRedPacketView')
      },
      wxShara () {
        // 弹出遮罩
        this.showShareView = true
      },
      isShare (share) {
        if (share.desc) {
          this.shareShow = true
          WeChat.menuShareAppMessage({
            desc: this.share.desc,
            imgUrl: this.share.icon_url,
            link: this.share.share_url,
            title: this.share.title,
            success: function () {
              this.showShareView = false
            },
            cancel: function () {
              this.showShareView = false
            }
          })
          WeChat.menuShareTimeline({
            imgUrl: this.share.icon_url,
            link: this.share.share_url,
            title: this.share.title,
            success: function () {
              this.showShareView = false
            },
            cancel: function () {
              this.showShareView = false
            }
          })
        }else {
          this.shareShow = false
        }
      },
      closeShareView () {
        this.showShareView = false
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
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -55%);
      border-radius: 12px;
      background: linear-gradient(to top, #fff, #ffecdf);
      // overflow: hidden;
      .red-packet-header {
        width: 100%;
        font-size: 36px;
        text-align: center;
        margin-top: 64px;
        font-family: PingFang SC-Medium;
        color: #4C3A3C ;
      }
      .red-packet-img {
        width: 622px;
        height: 492px;
        margin: 0 auto;
        padding: 10px 0 0 14px;
        img {
          width: 520px;
        }
        .RedPacketImg {
          width: 97%;
          height: 97%;
        }
        .OpenRedView{
          width: 600px;
          height: 476px;
          .OpenRedPacketImg {
            width: 100%;
            height: 100%;
          }
          span {
            display: inline-block;
            width: 310px;
            text-align: center;
            font-size: 52px;
            color: #680713;
            position: relative;
            top: -360px;
            left:150px;
            em {
              font-size: 72px;
            }
          }
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
      position: fixed;
      bottom: -100px;
      left: 300px;
    }
  }
  .shareView {
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
    z-index: 999;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    div {
      width: 70%;
      height: 440px;
      float: right;
      margin-right: 70px;
      margin-top: 30px;
      background: url(../assets/share_2.png) no-repeat;
      background-size: 100% ;
    }
  }
  // 红包展开动画
  @keyframes bounceOut {
    0% {
      opacity: 1;
      transform: scale3d(.1, .1, .1);
    }
    100% {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }
  .bounceOut {
    animation: bounceOut 0.5s;
  }
  @keyframes number {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .numberaa {
    animation: number 1s;
  }
</style>

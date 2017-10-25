<template>
  <div class="out-dark-view">
    <div class="inner-white-view">
      <section class="this-no-full" v-if="showNoFullView">
    	  <section class="header-text">
    	  	<div class="this-get-point">{{ curGetPoint }}</div>
    	    <div class="remind-info">{{ remindinfo }}</div>
    	  </section>
        <section class="point-view">
        	<div :class="ulView">
            <div class="lineOne">
              <div class="cir-point" v-for="index in fullPoints" v-if="index <= lineOneNumber">
                <span v-if="index <= curCardHave ? false : true">{{ index }}</span>
                <div class="starView" v-if="index <= curCardHave ? true : false">
                  <span class="newPoint" v-show="newPoint(index)"></span>
                </div>
              </div>
            </div>
            <div class="lineTwo" v-if='fullPoints > 5'>
              <div class="cir-point" v-for="index in fullPoints" v-if="index > lineOneNumber">
                <span v-if="index <= curCardHave ? false : true">{{ index }}</span>
                <div class="starView" v-if="index <= curCardHave ? true : false">
                  <span class="newPoint" v-show="newPoint(index)"></span>
                </div>
              </div>
            </div>
        	</div>
        	<p class="active-time">活动日期&nbsp;<span class="begin-time">{{ beginTime }}</span>-<span class="over-time">{{ overTime }}</span></p>
        </section>
        <section class="conversion" v-if="showExchange">
          <div class="have-number">你有<span>{{ exchangeNumber }}</span>个可兑换券</div>
          <div class="conversion-btn"><a :href="myCardsUrl">点击兑换</a></div>
        </section>
      </section>
      <section class="this-full" v-if="showFullView">
        <div class="full-view">
          <div class="test-info">
            <p class="congratulation-info">恭喜！</p>
            <p class="this-get-info">你本次获得了<span>{{ addExchange }}张</span>兑换券</p>
          </div>
          <div class="full-conversion-btn" >
            <a :href="myCardsUrl">点击兑换</a>
          </div>
        </div>
        <div class="new-car-info">
          <div class="new-car-has"><img src="../assets/Star_1.png" class="star">
            <span class="has-number-txt">新集点卡已集点：</span>
            <span class="has-number">{{  nextCardPoint }}/</span>
            <span class="all-number">{{ fullPoints }}</span>
          </div>
          <div class="to-points-car" @click="toNewCar()">集点卡<span class="icon-right-arrow"></span></div>
        </div>
      </section>
    	<section class="red-pakect-view" v-if="showRedPacketView">
    		<div class="red-pakect-img"><span class="redPacketNumber">¥&nbsp;<em>{{ redPacketNumber }}</em></span></div>
        <div class="right-info">
          <div :class="shareInfo">
            <p>老板给了你一个红包，</p>
            <p>快去<a :href="couponsUrl"><span>“我的红包”</span></a>看看吧!</p>
          </div>
          <div class="shara-btn" @click.stop="wxShara()" v-if="showSharaBtn" >点击分享,领取更多红包</div>
        </div>
    	</section>
      <span class="closeView" @click.stop="closeView()"><i class="icon-closed"></i></span>
    </div>
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
    props: ['activity', 'card', 'couponsUrl','customer'],
    data () {
      return {
        showRedPacketView: false, // 是否有红包活动
        ulView: 'ulDefault', // 1-5个集点默认样式
        curGetPoint: '',// 本次消费可以集点数
        remindinfo: '',// 集点提示信息
        fullPoints: 5,// 商家设定的集点点数
        lineOneNumber: 5, // 第一行显示的点数
        addExchange: 0,// 此次消费新增的兑换券个数
        showFullView: false, // 当前卡片集满
        showNoFullView: true, // 当前卡片未集满
        showExchange: false, // 点击兑换
        curCardHave: 0,// 当前卡片已经集的点数
        haveGet: false,
        shareInfo: 'default', // 分享按钮上面的文字样式
        showShareView: false,
        nextCardPoint: 0, // 当前卡片集满还有多余的集点  自动到下一张卡上
        exchangeNumber: 0,// 未兑换的兑换券数目
        beginTime: '', // 集点活动开始时间
        overTime: '', // 集点活动时间结束时间
        redPacketNumber: '', // 红包金额
        showSharaBtn: false, // 分享按钮
        myCardsUrl: '', // 我的兑换券链接
        customerId: '', // 顾客id
        activityId: '' // 活动id
      }
    },
    created () {
      /* 集点信息 */
      // 本次集点数
      let cur_get = this.card.customer_info.obtain_pts
      this.curGetPoint = '本次消费集'+cur_get+'点'
      // 格式化货币
      let goods_price = filter.formatCurrency(this.card.actv.goods_amt)
      // 差多少点集满
      let diff_exchange = this.card.customer_info.diff_exchange
      // remindinfo
      this.remindinfo = '再集'+diff_exchange+'点可获得'+goods_price+'元的'+this.card.actv.goods_name+'!'
      // 获取商家设置的点数
      // this.fullPoints = 3
      this.fullPoints = this.card.actv.exchange_pt
      // 根据商家的点数改变布局
      this.changePointsView(this.fullPoints)
      // 获取当前卡片已经集的点数
      this.curCardHave = this.card.actv.exchange_pt - this.card.customer_info.diff_exchange
      // 活动开始结束时间
      let start = new Date(this.card.actv.start_time*1000)
      let over = new Date(this.card.actv.expire_time*1000)
      this.beginTime = start.getFullYear()+'.'+(start.getMonth()+1)+'.'+start.getDate()
      this.overTime = over.getFullYear()+'.'+(over.getMonth()+1)+'.'+over.getDate()
      // 判断是否有兑换券未兑换
      this.checkExchange(this.card.customer_info.exchange)
      // 判断当前卡片集点数是否集满 是否有多余的几点
      this.checkPoints(this.card.customer_info.add_exchange, this.fullPoints, diff_exchange)
      // 获取此次消费新增的兑换券个数
      this.addExchange = this.card.customer_info.add_exchange
      /* 红包信息 */
      //判断是否有红包活动
      this.checkRedActv(this.activity)
      //获取顾客id与活动id
      this.customerId = this.customer.id
      this.activityId = this.card.actv.id
      // 获取 我的兑换券 链接
      this.myCardsUrl = 'http://m.haojin.in/v2/exchange-cards.html?customer_id='+this.customerId+'&activity_id='+this.activityId
      // 分享红包 链接数据
      const menuList = {
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
      }
      WeChat.showMenuItems(menuList)
      if (this.activity.share.desc) {
        WeChat.menuShareAppMessage({
          desc: this.activity.share.desc,
          imgUrl: this.activity.share.icon_url,
          link: this.activity.share.share_url,
          title: this.activity.share.title,
          success: function () {
            this.showShareView = false
          },
          cancel: function () {
            this.showShareView = false
          }
        })
        WeChat.menuShareTimeline({
          imgUrl: this.activity.share.icon_url,
          link: this.activity.share.share_url,
          title: this.activity.share.title,
          success: function () {
            this.showShareView = false
          },
          cancel: function () {
            this.showShareView = false
          }
        })
      }
    },
    methods: {
    	closeView () {
        this.$emit('hidePointView')
    	},
      wxShara () {
        this.showShareView = true
      },
      changePointsView (n) {
        switch (n) {
          case 1:
          case 2:
            this.ulView = 'ulClass_6';
            break;
          case 3:
            this.ulView = 'ulClass_7';
            break;
          case 4:
            this.ulView = 'ulClass_8';
            break;
          case 5:
            this.ulView = 'ulDefault';
            break;
          case 6:
            this.ulView = 'ulClass_1';
            this.lineOneNumber = 3;// 第一行显示的点数
            break;
          case 7:
            this.ulView = 'ulClass_2';
            this.lineOneNumber = 3; // 第一行显示的点数
            break;
          case 8:
            this.ulView = 'ulClass_3';
            this.lineOneNumber = 4; // 第一行显示的点数
            break;
          case 9:
            this.ulView = 'ulClass_4';
            this.lineOneNumber = 4; // 第一行显示的点数
            break;
          case 10:
            this.ulView = 'ulClass_5';
            this.lineOneNumber = 5; // 第一行显示的点数
            break;
          default:
            this.ulView = 'ulDefault';
        }
      },
      checkExchange (n) {
        if (n > 0) {
          this.showExchange = true
          this.exchangeNumber = n
        }else {
          this.showExchange = false
        }
      },
      checkPoints (n, exNumber, diffNumber) { // n: 本次新增兑换券个数 exNumber: 商家设定的点数 diffNumber： 当前卡片差的点数
        if (n>0) {
          this.showFullView = true
          this.showNoFullView = false
          this.nextCardPoint = exNumber - diffNumber // 显示本张兑换券集满多余的集点数
        }
      },
      newPoint (index) {
        let n = this.curCardHave - index
        if (n >= 0 && n < this.card.customer_info.obtain_pts ) {
          return true
        }else {
          return false
        }
      },
      checkRedActv (actv) { // 判断是否有红包活动
        if (JSON.stringify(actv) !== '{}') { // 红包活动存在
          this.showRedPacketView = true;
          //红包数值
          this.redPacketNumber = filter.formatCurrency(this.activity.coupons[0].amt)
          //判断红包类型 消费返红包 消费分享红包
          this.isShare(actv)
        } else {
          this.showRedPacketView = false;
        }
      },
      isShare (actv) {
        if (actv.share.desc !== "") {
          this.showSharaBtn = true
          this.shareInfo = 'boss-get-info'
        }else {
          this.showSharaBtn = false;
        }
      },
      closeShareView () {
        this.showShareView = false
      },
      toNewCar () {
        this.showFullView = false
        this.showNoFullView = true
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
	.out-dark-view {
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
    z-index: 200;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    .inner-white-view {
	    font-family: PingFang SC-Regular;
	    width: 86.6667%;
	    padding-bottom: 40px;
	    z-index: 300;
	    background-color: #fff;
	    border-radius: 12px;
	    position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -55%);
	    padding-top: 20px;
	    .this-no-full {
		    .header-text {
		      width: 100%;
		    	padding-bottom: 32px;
	    	  .this-get-point {
	    		  width: 100%;
	    			height: 76px;
	    			line-height: 72px;
	    			font-size: 36px;
	    			color: #8B62E9;
	    			font-family: PingFang SC-Medium;
	    			text-align: center;
	    		}
	    		.remind-info {
	    		  width: 100%;
	    			height: 40px;
	    			color: #2F323A;
	    			font-size: 26px;
	    			line-height: 40px;
	    			text-align: center;
	    		}
		    }
		    .point-view {
	    	  width: 570px;
	    		height: 324px;
	    		margin: 0 auto;
          padding-top: 1px;
	    		position: relative;
	    		border-radius: 8px;
	    		box-shadow: 0 4px 12px 0 rgba(165,83,236,0.15);
          > div {
            width: 100%;
            > div {
              margin: 0 auto;
  	          margin-top: 32px;
              height: 210px;
              display: -webkit-box;
              display: -webkit-flex;
              display: flex;
              justify-content: space-around;
              -webkit-justify-content: space-around;
              box-pack: justify;
              -webkit-box-pack: justify;
              align-items: center;
              box-align:center;
              -webkit-align-items: center;
              -webkit-box-align:center;
            }
          }
	    		.ulDefault {
            .lineOne{
              width: 520px;
            }
	    		}
          .ulClass_6{
            .lineOne{
              width: 260px;
            }
          }
          .ulClass_7{
            .lineOne{
              width: 360px;
            }
          }
          .ulClass_8{
            .lineOne{
              width: 440px;
            }
          }
          .ulClass_1{
            padding-top: 20px;
            .lineOne{
              width: 360px;
              height: 80px;
            }
            .lineTwo{
              width: 360px;
              height: 80px;
            }
          }
          .ulClass_2{
            padding-top: 20px;
            .lineOne{
              width: 360px;
              height: 80px;
            }
            .lineTwo{
              width: 440px;
              height: 80px;
            }
          }
          .ulClass_3{
            padding-top: 20px;
            .lineOne{
              width: 440px;
              height: 80px;
            }
            .lineTwo{
              width: 440px;
              height: 80px;
            }
          }
          .ulClass_4{
            padding-top: 20px;
            .lineOne{
              width: 440px;
              height: 80px;
            }
            .lineTwo{
              width: 520px;
              height: 80px;
            }
          }
          .ulClass_5{
            padding-top: 20px;
            .lineOne{
              width: 520px;
              height: 80px;
            }
            .lineTwo{
              width: 520px;
              height: 80px;
            }
          }
	    		.cir-point {
	    			font-size: 40px;
	    			text-align: center;
	    			color: #8B62E9;
            span {
              display: inline-block;
              width: 80px;
  	    			height: 80px;
              text-align: center;
  	    			line-height: 80px;
              border: 4px dashed #D3C5F6;
              border-radius: 50%;
              box-sizing: border-box;
            }
            .starView {
              width: 80px;
  	    			height: 80px;
              background-image: url(../assets/star.png);
              background-size: 100% 100%;
              .newPoint {
                border: none;
                position: relative;
                top: -30px;
                left: -18px;
                display: inline-block;
                width: 116px;
                height: 36px;
                background: url(../assets/Group@2x.png) no-repeat center center;
                background-size: 80% 80%;
              }
            }
	    		}
	        .active-time {
	        	font-size: 24px;
	          color: #8A8C92;
	          text-align: center;
	          height: 28px;
	          line-height: 28px;
	          margin: 30px auto 0;
	        }
		    }
		    .point-view:before { // 0.5px边框
				  content: '';
				  position: absolute;
				  width: 200%;
				  height: 200%;
				  border-radius: 16px;
				  border: 1px solid #DED3F7;
				  -webkit-transform-origin: 0 0;
				  -moz-transform-origin: 0 0;
				  -ms-transform-origin: 0 0;
				  -o-transform-origin: 0 0;
				  transform-origin: 0 0;
				  -webkit-transform: scale(0.5, 0.5);
				  -ms-transform: scale(0.5, 0.5);
				  -o-transform: scale(0.5, 0.5);
				  transform: scale(0.5, 0.5);
				  -webkit-box-sizing: border-box;
				  -moz-box-sizing: border-box;
				  box-sizing: border-box;
				}
		    .conversion {
	        width: 570px;
	        height: 174px;
          background-image: url(../assets/redpacket_bg3.png);
          background-size: 100% 100%;
	        margin: 40px auto 0;
	        .have-number {
	          width: 100%;
	          height: 72px;
            line-height: 84px;
	          font-size: 30px;
	          margin-top: 8px;
	          color: #2F323A;
	          text-align: center;
	          span {
	            font-size: 50px;
	              color: #A553EC;
	          	}
	        	}
	        .conversion-btn {
	          width: 326px;
	          height: 60px;
	          background-color: #FE9B20;
	          margin: 0 auto;
	          color: #fff;
	          text-align: center;
	          line-height: 60px;
	          border-radius: 118px;
	          font-size: 32px;
	          margin-top: 8px;
            a {
              color: #fff;
            }
	        }
		    }
		  }
      .this-full {
        margin-top: 20px;
        .full-view {
          width: 570px;
          height: 310px;
          margin: 0 auto;
          border: none;
          position: relative;
          background-image: url(../assets/redpacket_bg2.png);
          background-size: 120% 120%;
          background-position: -20px -20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px 0 rgba(165, 83, 236, 0.15);
          .test-info {
            width: 100%;
            overflow: hidden;
            .congratulation-info {
              width: 162;
              margin-top: 36px;
              margin-left: 225px;
              height: 76px;
              line-height: 76px;
              font-size: 54px;
              font-family: PingFang SC-Medium;
              color: #8B62E9;
            }
            .this-get-info {
              width: 100%;
              height: 36px;
              line-height: 36px;
              font-size: 32px;
              text-align: center;
              margin-top: 12px;
              color: #2F323A;
              span {
                color: #FE9B20;
              }
            }

          }
          .full-conversion-btn {
            width: 522px;
            height: 76px;
            font-size: 34px;
            line-height: 76px;
            background-color: #FE9B20;
            margin: 28px auto 0;
            border-radius: 8px;
            text-align: center;
            color: #fff;
            a {
              position: absolute;
              display: block;
              z-index: 999;
              color: #fff;
              width: 522px;
              height: 76px;
            }
          }
        }
        .full-view:before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          border-radius: 16px;
          border: 1px solid #E0DDE4;
          -webkit-transform-origin: 0 0;
          -moz-transform-origin: 0 0;
          -ms-transform-origin: 0 0;
          -o-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scale(0.5, 0.5);
          -ms-transform: scale(0.5, 0.5);
          -o-transform: scale(0.5, 0.5);
          transform: scale(0.5, 0.5);
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        .new-car-info {
          width: 570px;
          height: 56px;
          line-height: 56px;
          margin: 40px auto 0;
          .new-car-has {
            display: inline-block;
            font-size: 28px;
            height: 100%;
            overflow: hidden;
            font-family: PingFang SC-Medium;
            color: #2F323A;
            .star {
              display: inline-block;
              width:36px;
              height: 34px;
              float: left;
              margin-top: 8px;
            }
            .has-number-txt {
              display: inline-block;
              height: 100%;
              line-height: 56px;
              float: left;
              margin-left: 16px;
            }
            .has-number {
              font-size: 40px;
            }
            .all-number {
              font-size: 30px;
              font-family: PingFang SC-Regular;
            }
          }
          .to-points-car {
            font-size: 30px;
            color: #8B62E9;
            font-family: PingFang SC-Regular;
            font-weight: 300;
            float: right;
            display: inline-block;
            overflow: hidden;
            span {
              display: inline-block;
              margin-left: 12px;
              margin-top: 10px;
            }
          }
        }

		  }
			.red-pakect-view {
				width: 570px;
				height: 216px;
				margin: 40px auto 0;
				background: url(../assets/redpacket_bg1.png) no-repeat;
        background-size: 100% 100%;
		    .red-pakect-img {
	      	width: 176px;
	        height: 176px;
	        background-image: url(../assets/red_open2.png);
          background-size: 100% 100%;
	        float: left;
	        margin: 24px 15px 0 26px;
          color: #680713;
          span {
            display: inline-block;
            width: 106px;
            text-align: center;
            margin-top: 56px;
            margin-left: 20px;
            font-family: PingFang SC-Medium;
            font-size: 18px;
            em {
              font-size: 28px;
            }
          }
	      }
		    .right-info {
        	float: left;
        	margin-top: 24px;
          height: 170px;
          width: 340px;
        	.boss-get-info {
	        	width: 340px;
	        	height: 80px;
	        	font-size: 28px;
	        	color: #680713;
            margin-top: 8px;
          	p {
	          	width: 100%;
	            line-height: 40px;
	            text-align: center;
	            span {
            		color: #F12128;
	            }
	          }
        	}
          .default{
            width: 340px;
	        	height: 80px;
	        	font-size: 28px;
	        	color: #680713;
            margin-top: 50px;
            p {
	          	width: 100%;
	            line-height: 40px;
	            text-align: center;
	            span {
            		color: #F12128;
	            }
	          }
          }
        	.shara-btn {
          	height: 60px;
            width: 292px;
          	color: #FFFFFF;
				    font-size: 26px;
          	text-align: center;
          	line-height: 60px;
          	background-color: #F7503D;
          	border-radius: 6px;
				    margin-top: 18px;
            margin-left: 16px;
        	}
		    }
			}
  	}
	  .closeView {
	    display: block;
	    width: 100%;
	    height: 41px;
	    font-size: 41px;
	    color: #fff;
      position: fixed;
      bottom: -102px;
      text-align: center;
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
</style>

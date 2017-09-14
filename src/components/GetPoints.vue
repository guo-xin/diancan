<template>
  <div class="out-dark-view">
    <div class="inner-white-view">
      <section class="this-no-full" v-show="false">
    	  <section class="header-text">
    	  	<div class="this-get-point">{{ thisGetPoint }}</div>
    	    <div class="remind-info">{{ remindinfo }}</div>
    	  </section>
        <section class="point-view">
        	<ul>
        		<li class="cir-point">1</li>
        		<li class="cir-point">2</li>
        		<li class="cir-point">3</li>
        		<li class="cir-point">4</li>
        		<li class="cir-point">5</li>
        		<li class="cir-point">6</li>
        		<li class="cir-point">7</li>
        		<li class="cir-point">8</li>
        	</ul>
        	<p class="active-time">活动日期&nbsp;2016.5.10-2016.10.10</p>
        </section>
        <section class="conversion" v-show="true">
          <div class="have-number">你有<span>{{ 3 }}</span>个可兑换券</div>
          <div class="conversion-btn">点击兑换</div>
        </section>
      </section>
      <section class="this-full" v-show="true">
        <div class="full-view">
          <div class="test-info">
            <p class="congratulation-info">恭喜！</p>
            <p class="this-get-info">你本次获得了<span>1张</span>兑换券</p>
          </div>
          <div class="full-conversion-btn">点击兑换</div>
        </div>
        <div class="new-car-info">
          <div class="new-car-has"><span class="star"></span>
            <span class="has-number-txt">新集点卡已集点：</span>
            <span class="has-number">{{ 0 }}/</span>
            <span class="all-number">8</span>
          </div>
          <div class="to-points-car">集点卡<span></span></div>
        </div>
      </section>
    	<section class="red-pakect-view">
    		<div class="red-pakect-img"></div>
        <div class="right-info">
          <div class="boss-get-info">
            <p>老板给了你一个红包，</p>
            <p>快去<span>“我的红包”</span>看看吧!</p>
          </div>
          <div class="shara-btn">点击分享,领取更多红包</div>
        </div>
    	</section>
      <span class="closeView" @click.stop="closeView()"><i class="icon-closed"></i></span>
    </div>
  </div>
</template>
<script type=" text/ecmascript-6">
  export default {
    data () {
      return {
        thisGetPoint: '本次消费集1点',
        remindinfo: '再集5点可获得15.23元的超级大杯芒果欧蕾！'
      }
    },
    methods: {
    	closeView () {

    	}
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
	.out-dark-view {
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    .inner-white-view {
	    font-family: PingFang SC-Regular;
	    width: 86.6667%;
	    padding-bottom: 40px;
	    z-index: 2;
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
	        /*overflow: hidden*/
	    		ul {
	          width: 424px;
	          height: 190px;
	          margin: 0 auto;
	          margin-top: 52px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            align-content:space-between;
	    		}
	    		.cir-point {
	    			display: inline-block;
	    			width: 80px;
	    			height: 80px;
	    			font-size: 40px;
	    			text-align: center;
	    			line-height: 80px;
	    			color: #8B62E9;
					  border: 4px dashed #D3C5F6;
					  border-radius: 50%;
            box-sizing: border-box;
            margin-left: 34px;
            &:nth-child(1) {
              margin-left: 0;
            }
            &:nth-child(5) {
              margin-left: 0;
            }
	    		}
	        .active-time {
	        	font-size: 24px;
	          color: #8A8C92;
	          width: 400px;
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
	        border: 1px solid #DED3F7;
	        border-radius: 10px;
	        margin: 40px auto 0;
	        .have-number {
	          width: 100%;
	          height: 72px;
	          font-size: 30px;
	          margin-top: 8px;
	          color: #2F323A;
	          text-align: center;
	          span {
	            font-size: 50px;
	              color: #8B62E9;
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
          border-radius: 8px;
          box-shadow: 0 4px 12px 0 rgba(165,83,236,0.15);
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
              height: 56px;
              float: left;
              background-color: #fbf2e9;
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
            span {
              display: inline-block;
              width: 12px;
              height: 100%;
              background: url(../assets/ic_arrow_down_orange.png) right center;
              margin-left: 12px;
            }
          }
        }

		  }
			.red-pakect-view {
				width: 570px;
				height: 216px;
				border: 1px solid #ebe4db;
				border-radius: 10px;
				margin: 40px auto 0;
				background-color: #fbf2e9;
		    .red-pakect-img {
	      	width: 176px;
	        height: 176px;
	        background-color: #FE9B20;
	        float: left;
	        margin: 24px 15px 0 26px;
	      }
		    .right-info {
        	float: left;
        	margin-top: 24px;
        	.boss-get-info {
	        	width: 312px;
	        	height: 80px;
	        	font-size: 28px;
	        	color: #680713;
          	p {
	          	width: 100%;
	            line-height: 40px;
	            text-align: center;
	            span {
            		color: #ef323c;
	            }
	          }
        	}
        	.shara-btn {
          	height: 60px;
          	color: #FFFFFF;
				    font-size: 26px;
          	text-align: center;
          	line-height: 60px;
          	background-color: #F7503D;
          	border-radius: 6px;
				    margin-top: 20px;
        	}
		    }
			}
  	}
	  .closeView {
	    display: block;
	    width: 41px;
	    height: 41px;
	    font-size: 41px;
	    color: #fff;
      position: fixed;
      bottom: -102px;
      left: 305px;
	  }
  }
</style>

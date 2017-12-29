<template>
  <div id="outer-box">
    <div id="container" class="map" tabindex="0"></div>
    <div class="top-input flex alignC">
      <div class="fing-icon"></div>
      <input id="searchInput" placeholder="输入地址" v-on:input="adInput()" v-on:focus="pushRsult()" v-on:blur="pullRsult()"/>
      <div class="btn-icon flex alignC">
        <span class="close-icon" @click.stop="clearInpout()"></span>
        <span class="cancel-btn" @click.stop="cancel()">取消</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        src: '',
        info: {
          location: '',
          longitude: 0,
          latitude: 0,
          adcode: 0,
          city_code: 0
        },
        fromName: '',
        formattedAddress: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.fromName = from.name
      })
    },
    created () {
      this.resetViewport()
      this.formattedAddress = window.localStorage.getItem('formatted_address')
      document.body.style.overflow = 'hidden'
    },
    mounted () {
      this.initMap()
      /* eslint-disable */
    },
    beforeDestroy () {
      let element = document.getElementById('m')
      element.parentNode.removeChild(element)
    },
    destroyed () {
      this.deleteSug()
    },
    methods: {
      initMap (query) {
        if (query === 'cancel') this.deleteSug()
        var map,auto,positionPicker
        let _this = this
        let longitude = window.localStorage.getItem('longitude') || '116.397346'
        let latitude = window.localStorage.getItem('latitude') || '39.908627'

        // 地图初始化
         map = new AMap.Map('container', {
          zoom: 15,
          center: [longitude, latitude],
          resizeEnable: true
        })

        // 搜索提示
        AMap.plugin('AMap.Autocomplete',function() { // 回调函数
          var autoOptions = {
            city: '',
            input:"searchInput"//使用联想输入的input的id
          }
          auto = new AMap.Autocomplete(autoOptions)
          // 初始状态 按消费者当前位置进行搜索
          // let adr = window.localStorage.getItem('formatted_address')
          // // auto.search(adr)

          // 监听列表选中
          AMap.event.addListener(auto, "select", function(e){
            this.info = {
              location: e.poi.name,
              longitude: e.poi.location.lng,
              latitude: e.poi.location.lat,
              adcode: e.poi.adcode,
              city_code: 0
            }
            // 选中地址后跳转
            Object.assign(_this.$parent.tempAddr, this.info)
            if (this.fromName === 'addressList' || this.fromName === 'createOrder') {
                this.$router.push({
                name: 'addressUpdate'
              })
            } else {
              window.history.back()
            }
          })
        })
        // 拖拽ui
        AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
          // 拖拽
          positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map
          })
          positionPicker.on('success', function(positionResult) {
            if (positionResult.regeocode.pois.length) {
              document.getElementById('searchInput').value = ''
              auto.search(positionResult.regeocode.pois[0].name)
            } else {
              document.getElementById('searchInput').value = ''
              auto.search(_this.formattedAddress)
            }
          })
          positionPicker.start()
        })
      },
      resetViewport () {
        let m = document.createElement('meta')
        m.id = 'm'
        m.setAttribute('name', 'viewport')
        m.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0')
        let viewport = document.querySelector('meta[name=viewport]')
        viewport.parentNode.insertBefore(m, viewport.nextSibling)
      },
      cancel () {
        this.initMap('cancel')
      },
      clearInpout () {
        document.getElementById('searchInput').value = ''
      },
      adInput () {
        let value = document.getElementById('searchInput').value
        if (value === '') {
          // this.initMap(true)
        }
      },
      deleteSug () {
        let element = document.getElementsByClassName('amap-sug-result')[0] || document.getElementsByClassName('amap-sug-result1')[0]
        document.body.removeChild(element)
      },
      pushRsult () {
        document.getElementsByClassName('amap-sug-result')[0].className = 'amap-sug-result1'
      },
      pullRsult () {
        document.getElementsByClassName('amap-sug-result1')[0].className = 'amap-sug-result'
      }
    }
  }
</script>

<style  lang="scss" rel="stylesheet/scss">
  .flex {
    display:flex;
    display:-webkit-flex;
    display:-moz-flex;
    display:-o-flex;
    display:-ms-flex;
  }
  .alignV {
    -webkit-flex-flow: column;
    flex-flow:column;
  }
  .alignC {
    align-items: center;
    -webkit-align-items: center;
  }
  #outer-box {
    height: 50%;
    width: 100%;
    position: relative;
  }

  #container {
    height: 100%;
    width: 100%;
  }

  #searchInput {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: none!important;
    border-bottom: 1px solid #ccc;
    padding: 0 5px;
    width: 400px;
    text-indent: 10px;
    border: 2px solid #D8D8D8;
    border-radius: 6px;
    height: 80px;
    font-size: 32px;
  }
  .top-input {
    width: 100%;
    height: 90px;
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    padding: 0 5px;
    text-indent: 10px;
    position: absolute;
    top: 20px;
    left: 5%;
    width: 90%;
    z-index: 999;
    border: 2px solid #D8D8D8;
    border-radius: 6px;
    padding-left: 20px;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    .btn-icon {
      width: 200px;
      height: 100%;
      span {
        display: inline-block;
        width: 100px;
        text-align: center;
        font-size: 34px;
        color: #FF8100;
      }
      .close-icon {
        height: 50px;
        background: url(../assets/clear.png) center center no-repeat;
        background-size: 32px 32px;
        border-right: 4px solid #D8D8D8;
      }
    }
  }
  .fing-icon {
    width: 40px;
    height: 50px;
    background: url(../assets/find.png);
    background-size: 100% 100%;
  }

  .poi-more {
    display: none!important;
  }
  .amap-icon img {
    width: 100%!important;
    height: 100%!important;
  }
  .amap-sug-result {
    position: absolute!important;
    top: 604px!important;
    left: 0!important;
    right: 0!important;
    visibility: visible!important;
    color: #2F323A;
    height: 50%;
    overflow-y: scroll;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .auto-item {
      padding: 20px 60px 10px 20px;
      font-size: 32px;
      font-family: PingFangSC-Semibold;
      .auto-item-span {
        color: #2F323A;
        font-size: 24px;
        display: block;
        line-height: 50px;
        padding-left: 0;
        font-family: PingFangSC-Regular;
      }
    }
    .auto-item:hover {
      background-color: #fff!important;
    }
  }
  .amap-sug-result1 {
    position: absolute!important;
    top: 140px!important;
    left: 0!important;
    right: 0!important;
    visibility: visible!important;
    color: #2F323A;
    height: 85%;
    overflow-y: scroll;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 -4px 8px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .auto-item {
      padding: 20px 60px 10px 20px;
      font-size: 32px;
      font-family: PingFangSC-Semibold;
      .auto-item-span {
        color: #2F323A;
        font-size: 24px;
        display: block;
        line-height: 50px;
        padding-left: 0;
        font-family: PingFangSC-Regular;
      }
    }
    .auto-item:hover {
      background-color: #fff!important;
    }
  }
  .amap-copyright {
    visibility: hidden!important;
  }
  .amap-logo {
    visibility: hidden!important;
  }
</style>

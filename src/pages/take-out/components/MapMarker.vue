<template>
  <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" id="test" :src="$route.query.src"></iframe>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        info: {
          contact_name: '',
          mobile: '',
          detail_addr: '',
          location: '',
          longitude: 0,
          latitude: 0,
          adcode: 0,
          city_code: 0
        }
      }
    },
    created () {
      Object.assign(this.info, this.$parent.tempAddr)
      this.resetViewport()
    },
    mounted () {
      /* eslint-disable */
      let _this = this
      let iframe = document.getElementById('test').contentWindow
      document.getElementById('test').onload = function(){
        iframe.postMessage('hello','https://m.amap.com/picker/')
      }
      let listener = function (e) {
        let coord = []
        if (e.data.name) {
          window.removeEventListener('message', listener, false)
          _this.info.location = e.data.name
          coord = e.data.location.split(',')
          _this.info.longitude = coord[0]
          _this.info.latitude = coord[1]
          _this.getAdcode(coord[0], coord[1])
        }
      }
      window.addEventListener('message', listener, false)
    },
    beforeDestroy () {
      let element = document.getElementById('m')
      element.parentNode.removeChild(element)
    },
    methods: {
      getAdcode (longitude, latitude) {
        this.$http({
          url: 'http://restapi.amap.com/v3/geocode/regeo',
          method: 'JSONP',
          params: {
            format: 'jsonp',
            key: '9eb1cfce5386a0d7ad316255968c78bd',
            location: `${longitude},${latitude}`
          }
        }).then(function (res) {
          this.info.adcode = res.data.regeocode.addressComponent.adcode
          this.info.city_code = res.data.regeocode.addressComponent.citycode
          this.$parent.tempAddr = this.info
          window.history.go(-1)
        })
      },
      resetViewport () {
        let m = document.createElement('meta')
        m.id = 'm'
        m.setAttribute('name', 'viewport')
        m.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0')
        let viewport = document.querySelector('meta[name=viewport]')
        viewport.parentNode.insertBefore(m, viewport.nextSibling)
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .main-header .picker-index .back {
    display: none;
    margin-left: 20px;
  }
</style>

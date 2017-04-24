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
          adcode: 0
        }
      }
    },
    route: {
      data (transition) {
        Object.assign(this.info, this.$root.tempAddr)
        transition.next()
      }
    },
    ready () {
      /* eslint-disable */
      let _this = this
      let iframe = document.getElementById('test').contentWindow
      document.getElementById('test').onload = function(){
        iframe.postMessage('hello','https://m.amap.com/picker/')
      }
      let listener = function (e) {
        let addressInfo = JSON.parse(window.sessionStorage.getItem('info')) || {}
        let coord = []
        if (e.data.name) {
          window.removeEventListener('message', listener, false)
          _this.info.location = e.data.name
          coord = e.data.location.split(',')
          _this.info.longitude = coord[0]
          _this.info.latitude = coord[1]
          _this.$root.tempAddr = _this.info
          window.history.go(-1)
        }
      }
      window.addEventListener('message', listener, false)
    },
    created () {
      this.resetViewport()
    },
    beforeDestroy () {
      let element = document.getElementById('m')
      element.parentNode.removeChild(element)
    },
    methods: {
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

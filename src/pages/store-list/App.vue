<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
      }
    },
    created () {
    },
    computed: {
    },
    mounted () {
      if (window.location.hash === '#!/' || window.location.hash === '#/') {
        let url = window.location.origin + window.location.pathname + window.location.search + window.sessionStorage.getItem('redirect_uri')
        window.location.replace(url)
      }
    },
    methods: {
      setOpenId () {
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">

</style>

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
      this.$wechat.init()
      this.$wechat.ready()
      .then(() => {
        this.$wechat.hideOptionMenu()
        this.$wechat.getFormattedAddress()
      })
    },
    computed: {
    },
    mounted () {

    },
    methods: {
      setOpenId () {
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">

</style>

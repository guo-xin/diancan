<template>
  <div class="">
    <h1>{{ msg }}</h1>
    <button @click="clear">清除本地存储</button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
  },
  data () {
    return {
      msg: '关于!'
    }
  },
  methods: {
    clear () {
      window.localStorage.clear()
      window.sessionStorage.clear()
      this.msg = 'OK!'
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
h1 {
  color: #42b983;
}
</style>

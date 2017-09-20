<template>
  <div class="c-nodata">
    <p>{{ msg }}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    components: {},
    data () {
      return {
        msg: '暂无数据'
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .c-nodata {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>

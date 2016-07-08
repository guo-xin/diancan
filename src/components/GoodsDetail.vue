<template>
  <div class="c-goods-detail" v-if="visible" @click.stop.prevent="closeHandler()">
    <div class="l-c-c main">
      <div>
        <div class="close" @click.stop.prevent="closeHandler()"><i class="iconfont">&#xe604;</i></div>
        <div class="img"><img :src="goods.img"></div>
        <h2>{{goods.name}}</h2>
        <p>{{goods.spec_list[specIndex].descr}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    components: {},
    props: ['goods', 'visible'],
    data () {
      return {
        specIndex: 0
      }
    },
    methods: {
      closeHandler () {
        this.visible = false
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .c-goods-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 42px 30px;
    background-color: rgba(0, 0, 0, .75);
    z-index: 113;
  }

  .main {
    /*position: relative;*/
    /*padding-top: 78px;*/
    height: 100%;
    overflow-y: auto;
    color: #fff;
  }

  .close {
    padding: 10px;
    text-align: right;
    i {
      font-size: 60px;
      font-weight: normal;
      color: #D8D8D8;
    }
  }

  .img {
    width: 690px;
    height: 690px;
    border-radius: 12px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }

  h2 {
    padding: 26px 0;
    font-size: 34px;
    font-weight: normal;
    border-bottom: 2px solid #E5E5E5; /*px*/
    color: #FFF;
  }

  p {
    margin-top: 38px;
    font-size: 30px;
  }
</style>

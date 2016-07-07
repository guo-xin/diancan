<template>
  <div class="l-r item-add show-all">
    <div class="btn-touch" v-show="count" @click.stop="minus($event, goods, activate)">
      <span class="l-c-c btn-minus">
      <i class="iconfont">&#xe601;</i>
    </span>
    </div>
    <span class="item-count" v-show="count">{{count}}</span>
    <div class="btn-touch" @click.stop="plus($event, goods, activate)">
      <span class="l-c-c btn-plus">
      <i class="iconfont">&#xe600;</i>
    </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 商品选择
   */
  export default {
    props: {
      goods: Object,
      activate: {
        type: Number,
        default: 0
      },
      minus: Function,
      plus: Function
    },
    data () {
      return {
      }
    },
    computed: {
      count () {
        return this.goods.spec_list[0]._count
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  /*加入购物车*/
  .item-add {
    &.show-all {
      /*width: 200px;*/
    }

    .btn-touch {
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;

      /*background-color: #f8f8f8;*/
      /*border: 2px solid #c0c0c0;*/
    }
    .btn-minus, .btn-plus {

      box-sizing: border-box;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid #C2C2C2;  /*px*/
      background: #fff;

      i {
        font-size: 30px;
        color: #FE9B20;
        font-weight: 700;
      }
    }
    .item-count {
      display: block;
      width: 50px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 40px;
      color: #2f323a;
    }
  }
</style>

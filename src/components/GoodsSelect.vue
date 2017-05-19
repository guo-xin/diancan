<template>
  <div class="l-r item-add show-all">
    <div class="btn-touch" v-show="count" @click.stop="minus($events, goods, activate)">
      <i class="icon-reduce"></i>
    </span>
    </div>
    <input class="item-count" type="tel" v-show="count" :value="count" v-model="countValue" @focus="focusHandler(count)" @blur="blurHandler">
    <div class="btn-touch" @click.stop="plus($events, goods, activate)">
      <i class="icon-add"></i>
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
      plus: Function,
      diy: Function
    },
    data () {
      return {
        countValue: '',
        oldValue: ''
      }
    },
    watch: {
    },
    computed: {
      count () {
        return this.goods.spec_list[this.activate]._count
      }
    },
    methods: {
      focusHandler (count) {
        this.oldValue = count
      },
      blurHandler (e) {
        let val
        if (isNaN(Number(this.countValue)) || Number(this.countValue) > 999) {
          val = this.oldValue
          this.countValue = this.oldValue
        } else {
          val = e.target.value
        }
        this.diy(this.$event, this.goods, this.activate, parseInt(val))
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/iconfont/iconfont.css";
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
      i {
        font-size: 52px;
        color: #FF8100;
      }
    }
    .item-count {
      display: block;
      width: 2em;
      height: 80px;
      line-height: 1;
      margin: 0;
      margin-top: 10px;
      text-align: center;
      font-size: 40px;
      color: #2f323a;
      padding: 20px 0;
      border: none;
      background-color: transparent;
      &:focus {
        border: none;
      }
    }
  }
</style>

<template>
  <div class="l-r item-add show-all">
    <div class="btn-touch" v-show="countValue" @click.stop="minus()">
      <i class="icon-reduce"></i>
    </span>
    </div>
    <input class="item-count" type="tel" v-show="countValue" v-model.number="countValue" @blur="blurHandler($event)">
    <div class="btn-touch" @click.stop="plus()">
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
      goodsType: String,
      count: {
        type: Number,
        default: 0
      },
      selectedSpecAttr: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
      }
    },
    created () {
    },
    computed: {
      countValue () {
        return this.count
      }
    },
    methods: {
      plus () {
        let count = this.countValue + 1
        if (this.goodsType === 'single') {
          this.$emit('updateGoodsCount', this.goods.cate_id, this.goods.unionid, count, 'plus')
        } else {
          this.$emit('updateCatesCount', this.goods.cate_id, count, 'plus')
          this.$emit('updateSpecAttrsCount', this.selectedSpecAttr, count)
        }
        this.$emit('changeCart', this.goods, count)
      },
      minus () {
        let count = this.countValue - 1
        if (this.goodsType === 'single') {
          this.$emit('updateGoodsCount', this.goods.cate_id, this.goods.unionid, count, 'minus')
        } else {
          this.$emit('updateCatesCount', this.goods.cate_id, count, 'minus')
          this.$emit('updateSpecAttrsCount', this.selectedSpecAttr, count)
        }
        this.$emit('changeCart', this.goods, count)
      },
      diy (val) {
        if (this.goodsType === 'single') {
          this.$emit('updateGoodsCount', this.goods.cate_id, this.goods.unionid, val, 'diy')
        } else {
          this.$emit('updateCatesCount', this.goods.cate_id, val, 'diy')
          this.$emit('updateSpecAttrsCount', this.selectedSpecAttr, val)
        }
        this.$emit('changeCart', this.goods, val)
      },
      blurHandler (e) {
        let val = e.target.value || 0
        this.diy(parseInt(val))
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
      box-sizing: border-box;
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

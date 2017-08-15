<template>
  <div class="spec-container" v-if="visible">
    <transition name="zoomInOut">
      <div class="spec" v-if="visible">
        <div class="close" @click.stop="closeSpec()"><i class="icon-closed"></i></div>
        <div class="head line">{{goods.name}}</div>
        <section class="body">
          <ul class="spec-list line">
            <li v-for="(_spec, index) in goods.spec_list"
                :class="{'activate': index === goods._lastSpec}"
                @click.stop.prevent="selectSpec(index)">{{_spec.name}}
            </li>
          </ul>
          <div class="price">
            单价：<span><em class="dollar">¥&nbsp;</em>{{spec.txamt|formatCurrency}}</span>
            <span class="orgtxamt text-line-through" v-if="spec.orgtxamt && spec.orgtxamt !== spec.txamt"><em>¥&nbsp;</em>{{spec.orgtxamt|formatCurrency}}</span>
          </div>
        </section>

        <button v-show="!spec._count" class="btn add-cart" @click.stop.prevent="plus(goods, lastSpec)">
          加入购物车
        </button>
        <!--商品选择-->
        <goods-select v-show="spec._count" class="goods-select-container"
                      :goods="goods"
                      :activate="lastSpec"
                      :plus="plus"
                      :minus="minus"
                      :diy="diy"></goods-select>
      </div>
    </transition>
    <div class="mark" @click.stop="closeSpec()" @touchmove.prevent></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import GoodsSelect from '../components/GoodsSelect'
  export default {
    components: {GoodsSelect},
    props: ['goods', 'plus', 'minus', 'diy', 'visible'],
    data () {
      return {
      }
    },
    computed: {
      lastSpec () {
        return this.goods._lastSpec
      },
      spec () {
        return this.goods.spec_list[this.goods._lastSpec]
      }
    },
    methods: {
      selectSpec (index) {
        let goods = this.goods
        goods._lastSpec = index
        this.$emit('selectSpecBtn', goods, index)
      },
      closeSpec () {
        this.$emit('hideSpecHandler')
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/base/animate";
  .spec-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 112;
  }

  .mark {
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .spec {
    box-sizing: border-box;
    position: relative;
    padding: 0 30px;
    width: 92%;
    background-color: #fff;
    border-radius: 6px;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    text-align: right;
    i {
      font-size: 40px;
      font-weight: normal;
      color: #D8D8D8;
    }
  }

  .head {
    height: 86px;
    line-height: 86px;
    font-size: 34px;
    color: #2F323A;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .line {
    border-bottom: 2px solid #E5E5E5; /*px*/
  }

  .spec-list {
    max-height: 400px;
    overflow-y: scroll;
    padding-top: 38px;
    li {
      display: inline-block;
      margin-right: 30px;
      margin-bottom: 36px;
      padding: 10px 20px;
      line-height: 1.4;
      border-radius: 32px;
      font-size: 30px;

      color: #FF8100;
      border: 2px solid #FF8100;

      &.activate {
        background-color: #FF8100;
        color: #fff;
        border: none;
      }
    }
  }

  .price {
    height: 134px;
    line-height: 134px;
    font-size: 34px;
    color: #2F323A;
    span {
      color: #FE9B20;
    }
    .orgtxamt {
      margin-left: 5px;
      font-size: 26px;
      color: #8A8C92;
    }
  }

  .goods-select-container {
    position: absolute;
    right: 10px;
    bottom: 20px;
  }

  .add-cart {
    position: absolute;
    right: 30px;
    bottom: 40px;
    width: 222px;
    height: 60px;
    border-radius: 30px;
    font-size: 30px;
    border: 0;
    color: #fff;
    background-color: #FF8100;
  }

</style>

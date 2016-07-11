<template>
  <div class="container" v-if="visible" @click.stop.prevent="visible=false">
    <div class="spec" v-if="visible" transition="zoomInOut" @click.stop.prevent="nullFunction">
      <div class="close" @click.stop.prevent="visible=false"><i class="iconfont">&#xe604;</i></div>
      <div class="head line">{{goods.name}}</div>
      <section class="body">
        <ul class="spec-list line">
          <li v-for="_spec in goods.spec_list"
              :class="{'activate': $index===activateIndex}"
              @click.stop.prevent="selectSpec($index)">{{_spec.name}}
          </li>
        </ul>
        <div class="price">
          单价：<span><em class="dollar">¥&nbsp;</em>{{spec.txamt|formatCurrency}}</span>
        </div>
      </section>

      <button v-show="!spec._count" class="btn add-cart" @click.stop.prevent="plus($event, goods, activateIndex)">
        加入购物车
      </button>
      <!--商品选择-->
      <goods-select v-show="spec._count" class="goods-select-container"
                    :goods="goods"
                    :activate="activateIndex"
                    :plus="plus"
                    :minus="minus"></goods-select>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import GoodsSelect from '../components/GoodsSelect'
  export default {
    components: {GoodsSelect},
    props: ['visible', 'goods', 'plus', 'minus'],
    data () {
      return {
        activateIndex: 0
      }
    },
    created () {
    },
    computed: {
      spec () {
        return this.goods.spec_list[this.activateIndex]
      }
    },
    methods: {
      selectSpec ($index) {
        this.activateIndex = $index
      },
      nullFunction () {
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/base/animate";
  .container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .7);
    z-index: 112;
  }

  .spec {
    position: relative;
    margin: 0 30px;
    padding: 0 30px;
    /*height: 410px;*/
    width: 100%;
    background-color: #fff;
    border-radius: 6px;
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    text-align: right;
    i {
      font-size: 50px;
      font-weight: normal;
      color: #D8D8D8;
    }
  }

  .head {
    height: 86px;
    line-height: 86px;
    font-size: 34px;
    color: #2F323A;
  }

  .line {
    border-bottom: 2px solid #E5E5E5; /*px*/
  }

  .spec-list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 38px;
  }

  li {
    margin-right: 30px;
    margin-bottom: 38px;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    border-radius: 32px;
    font-size: 30px;

    color: #FE9B20;
    border: 2px solid #C2C2C2;  /*px*/

    &.activate {
      background-color: #FE9B20;
      color: #fff;
      border: none;
    }
  }

  .price {
    /*padding-top: 48px;*/
    height: 134px;
    line-height: 134px;
    font-size: 34px;
    color: #2F323A;
    span {
      color: #FE9B20;
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
    line-height: 60px;
    border-radius: 30px;
    font-size: 30px;
    border: 0;
    color: #fff;
    background-color: #FE9B20;
  }

</style>

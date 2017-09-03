<template>
  <div class="spec-container" v-if="visible">
    <div class="spec" v-if="visible">
      <header>
        <div class="close" @click.stop="closeSpec()"><i class="icon-closed"></i></div>
        <div class="head">{{goods.name}}</div>
      </header>
      <section class="spec-list-container" ref="spec">
        <div>
          <dl class="spec-list">
            <dt>规格</dt>
            <dd v-for="(_spec, index) in goods.spec_list" v-show="_spec.name"
                :class="{'activate': index === selectedSpecAttr[0]}"
                @click.stop.prevent="selectSpec(index)">{{_spec.name}}
            </dd>
          </dl>
          <dl class="spec-list" v-for="(_attr, attrListIndex) in goods.attr_list">
            <dt>{{_attr.attr_name}}</dt>
            <dd v-for="(_attrValue, attrIndex) in _attr.attr_value_list"
                :class="{'activate': attrIndex === selectedSpecAttr[attrListIndex + 1]}"
                @click.stop.prevent="selectAttr(attrListIndex, attrIndex)">{{_attrValue.value_name}}
            </dd>
          </dl>
        </div>
      </section>
      <footer class="price">
        单价：<span><em class="dollar">¥&nbsp;</em>{{spec.txamt|formatCurrency}}</span>
        <span class="orgtxamt text-line-through" v-if="spec.orgtxamt && spec.orgtxamt !== spec.txamt"><em>¥&nbsp;</em>{{spec.orgtxamt|formatCurrency}}</span>
      </footer>

      <!-- 商品+-选择 -->
      <goods-select class="goods-select-container"
                    :goods="goods"
                    :selectedSpecAttr="selectedSpecAttr.toString()"
                    :count="goods.specAttrsCount[selectedSpecAttr]"
                    @updateGoodsCount="updateGoodsCount"
                    @changeCart="changeCartSpecAttr">
      </goods-select>

      <!--商品选择-->
      <!-- <goods-select class="goods-select-container"
                    :goods="goods"
                    :activate="lastSpec"
                    :plus="plus"
                    :minus="minus"
                    :diy="diy"></goods-select> -->
    </div>
    <div class="mark" @click.stop="closeSpec()" @touchmove.stop.prevent></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import GoodsSelect from '../components/GoodsSelect'
  import store from '../vuex/store'
  export default {
    components: {GoodsSelect},
    props: ['goods', 'visible', 'updateGoodsCount'],
    data () {
      return {
        scroller: null,
        selectedSpecAttr: [0],
        specAttrsCount: {}
      }
    },
    watch: {
      'visible': function (val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            this.selectedSpecAttr = [0]
            this.goods.attr_list.map((index) => {
              this.selectedSpecAttr.push(0)
            })
            this.carts.map((cart) => {
              this.specAttrsCount[cart.selectedSpecAttr] = cart.count
            })
            console.log('this.specAttrsCount')
            console.log(this.specAttrsCount)
            this.scroller = new BScroll(this.$refs.spec, {
              startX: 0,
              startY: 0,
              click: true
            })
          })
        }
      }
    },
    computed: {
      carts () {
        return this.$store.getters.getCarts
      },
      spec () {
        return this.goods.spec_list[this.selectedSpecAttr[0]]
      }
    },
    created () {
      console.log('selectSpec created')
      console.log(this.goods)
    },
    methods: {
      changeCartSpecAttr (goods, count) {
        let attrValues = []
        let attrValuesString = ''
        goods.attr_list.map((attr, index) => {
          let attrValue = attr.attr_value_list[this.selectedSpecAttr[index + 1]]
          attrValues.push(attrValue)
          attrValuesString += `，${attrValue.value_name}`
        })
        let cartIndex = this.carts.findIndex((g) => {
          return g.attrValuesString === attrValuesString
        })
        if (cartIndex < 0) {
          let cartGoods = {
            name: goods.name,
            cate_id: goods.cate_id,
            unionid: goods.unionid,
            count: 1,
            spec: goods.spec_list[this.selectedSpecAttr[0]],
            type: 'multi-attr',
            attrValues: attrValues,
            attrValuesString: attrValuesString,
            selectedSpecAttr: this.selectedSpecAttr.toString()
          }
          store.commit('ADDCARTS', cartGoods) // 新增
        } else {
          if (count === 0) {
            this.carts.splice(cartIndex, 1) // 移除
          } else {
            store.commit('UPDATECARTCOUNT', { // +1
              index: cartIndex,
              count
            })
          }
        }
      },
      selectSpec (index) {
        console.log('selectSpec')
        console.log(index)
        this.$set(this.selectedSpecAttr, 0, index)
        // this.selectSpecAttr[0] = index
      },
      selectAttr (attrListIndex, attrIndex) {
        this.$set(this.selectedSpecAttr, attrListIndex + 1, attrIndex)
        // this.selectSpecAttr[attrListIndex + 1] = attrIndex
        console.log('selectSpec')
      },
      descartes (args) {
        let isArray = function (o) {
          return Object.prototype.toString.call(o) === '[object Array]'
        }
        let rs = []

        for (let i = 0; i < args.length; i++) {
          if (!isArray(args[i])) {
            return false  // 参数必须为数组
          }
        }

        // 两个笛卡尔积换算
        let bothDescartes = function (m, n) {
          let r = []
          for (let i = 0; i < m.length; i++) {
            for (let ii = 0; ii < n.length; ii++) {
              let t = []
              if (isArray(m[i])) {
                t = m[i].slice(0)  // 此处使用slice目的为了防止t变化，导致m也跟着变化
              } else {
                t.push(m[i])
              }
              t.push(n[ii])
              r.push(t)
            }
          }
          return r
        }

        // 多个笛卡尔基数换算
        for (let i = 0; i < args.length; i++) {
          if (i === 0) {
            rs = args[i]
          } else {
            rs = bothDescartes(rs, args[i])
          }
        }

        console.log(rs)
        return rs
      },
      closeSpec () {
        this.$emit('hideSpecHandler')
      },
      refresh () {
        this.$nextTick(() => {
          this.scroller.refresh()
          this.scroller.scrollTo(0, 0)
        })
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
    border-bottom: 2px solid #E5E5E5;
    font-size: 34px;
    color: #2F323A;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .spec-list-container {
    max-height: 400px;
    overflow: hidden;
  }

  .spec-list {
    margin: 0;
    padding-top: 20px;
    font-size: 24px;
    dt {
      color: #a7a9ae;
      margin-bottom: 16px;
    }
    dd {
      display: inline-block;
      margin: 0 24px 20px 0;
      padding: 14px 24px;
      line-height: 1.4;
      border-radius: 32px;

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
    border-top: 2px solid #E5E5E5;
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

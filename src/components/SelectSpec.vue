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
                    :count="specAttrsCount[selectedSpecAttr.toString()]"
                    @updateCatesCount="updateCatesCount"
                    @updateSpecAttrsCount="updateSpecAttrsCount"
                    @changeCart="changeCartSpecAttr">
      </goods-select>
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
    props: ['goods', 'visible', 'updateCatesCount'],
    data () {
      return {
        mchnt_id: this.$route.params.mchnt_id,
        scroller: null,
        selectedSpecAttr: [0],
        specAttrsCount: {}
      }
    },
    watch: {
      'visible': function (val, oldVal) {
        if (val) {
          this.specAttrsCount = {}
          this.$nextTick(() => {
            this.selectedSpecAttr = [0]
            this.goods.attr_list.map((index) => {
              this.selectedSpecAttr.push(0)
            })
            // 打开规格弹框时，同步购物车各种规格的数量
            this.carts.map((cart) => {
              if (cart.unionid === this.goods.unionid) {
                this.$set(this.specAttrsCount, cart.selectedSpecAttr, cart.count)
              }
            })
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
    },
    methods: {
      changeCartSpecAttr (goods, count) {
        let attrList = []
        let attrValuesString = ''
        if (goods.attr_list) {
          goods.attr_list.map((attr, index) => {
            let attrValue = attr.attr_value_list[this.selectedSpecAttr[index + 1]]
            let attrValueArray = [] // 后端下单接口makeorder attr_value_list 只支持'数组'格式
            attrValueArray.push(attrValue)
            attrList.push({
              attr_id: attr.attr_id,
              attr_name: attr.attr_name,
              attr_value_list: attrValueArray
            })
            attrValuesString += `，${attrValue.value_name}`
          })
        }
        let type = goods.attr_list.length === 0 ? 'spec' : 'attr'
        let cartIndex = this.carts.findIndex((g) => {
          if (type === 'spec') {
            let selectedSpecIndex = parseInt(this.selectedSpecAttr[0])
            return g.spec.id === goods.spec_list[selectedSpecIndex].id
          } else {
            return g.unionid === goods.unionid && g.selectedSpecAttr === this.selectedSpecAttr.toString()
          }
        })
        if (cartIndex < 0) {
          let cartGoods = {
            name: goods.name,
            cate_id: goods.cate_id,
            unionid: goods.unionid,
            count: 1,
            spec: goods.spec_list[this.selectedSpecAttr[0]],
            type: type,
            attr_list: attrList,
            attrValuesString: attrValuesString,
            selectedSpecAttr: this.selectedSpecAttr.toString()
          }
          store.commit('ADDCARTS', cartGoods) // 新增
        } else {
          if (count === 0) {
            store.commit('DELCARTS', cartIndex) // 移除
          } else {
            store.commit('UPDATECARTCOUNT', { // +1
              index: cartIndex,
              count
            })
          }
        }
        localStorage.setItem(`carts${this.mchnt_id}`, JSON.stringify(this.carts))
      },
      updateSpecAttrsCount (selectedSpecAttr, count) {
        this.$set(this.specAttrsCount, selectedSpecAttr, count)
      },
      selectSpec (index) {
        this.$set(this.selectedSpecAttr, 0, index)
      },
      selectAttr (attrListIndex, attrIndex) {
        this.$set(this.selectedSpecAttr, attrListIndex + 1, attrIndex)
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
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  .mark {
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }

  .spec {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
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
      padding: 10px 24px;
      min-width: 100px;
      box-sizing: border-box;
      text-align: center;
      line-height: 1.4;
      border-radius: 32px;
      color: #2F323A;
      background-color: #ededed;
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

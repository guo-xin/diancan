<template>
  <div class="c-goods-detail" v-if="visible" @click.stop.prevent="closeHandler()">
    <transition name="zoomInOut">
      <div class="l-c-c main" v-if="visible">
        <div>
          <div class="close" @click.stop.prevent="closeHandler()"><i class="icon-closed"></i></div>
          <div class="img imgbox">
            <div class="img" :style="{'background-image': 'url(' + goods.img + '?imageView2/1/w/120/h/120)'}">
              <img :src="goods.img ? goods.img + '?imageView2/1/w/400/h/400' : '../assets/default_food_pic_big.png' ">
              <!--<div class="img" :style="{'background-image': 'url(' + goods.img + '?imageView2/1/w/400/h/400)'}"></div>-->
            </div>
          </div>
          <h2>{{goods.name}}</h2>
          <p>{{goods.spec_list[specIndex].descr}}</p>
        </div>
      </div>
    </transition>
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
  @import "../styles/base/animate";
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

  .imgbox {
    background-image: url('data:image/png;base64,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');
  }

  .img {
    width: 690px;
    height: 690px;
    border-radius: 12px;
    overflow: hidden;
    background-size: contain;
    /*background-size: cover;*/
    background-repeat: no-repeat;
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

<template>
  <div class="weui_dialog_alert" id="dialog" v-show="visible">
    <div class="weui_mask"></div>
    <div class="weui_dialog">
      <div v-if="title" class="weui_dialog_hd"><strong class="weui_dialog_title">{{title}}</strong></div>
      <div class="weui_dialog_bd">{{content}}</div>
      <div class="weui_dialog_ft">
        <a href="javascript:;" class="weui_btn_dialog cancel" @click="cancel">取消</a>
        <a href="javascript:;" class="weui_btn_dialog primary" @click="confirm">继续下单</a>
      </div>
    </div>
  </div>
</template>
<script>
  /*
  * alertTitle 提示的标题
  * alertTip 提示的文案
  *
  *
  */
  export default {
    props: ['title', 'content', 'visible', 'confirmEvent'],
    data () {
      return {
      }
    },
    methods: {
      cancel () {
        this.visible = false
      },
      confirm () {
        this.visible = false
        this.$emit('confirmEvent')
        // this.$dispatch(this.confirmEvent)
      }
    }
  }
</script>
<style>
  .weui_mask {
    position: fixed;
    z-index: 111;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .weui_dialog {
    position: fixed;
    z-index: 113;
    width: 66%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #FAFAFC;
    text-align: center;
    border-radius: 8px;
    overflow: hidden;
  }
  .weui_dialog_confirm .weui_dialog .weui_dialog_hd {
    padding: 1.2em 20px .5em;
  }
  .weui_dialog_confirm .weui_dialog .weui_dialog_bd {
    text-align: left;
  }
  .weui_dialog_hd {
    padding: 1.2em 0 0 0;
  }
  .weui_dialog_title {
    font-weight: 400;
    font-size: 34px;
  }
  .weui_dialog_bd {
    padding: 0 30px;
    font-size: 30px;
    margin: 30px 0 10px;
    color: #2F323A;
    word-wrap: break-word;
    word-break: break-all;
  }
  .weui_dialog_ft {
    position: relative;
    line-height: 84px;
    margin-top: 40px;
    font-size: 34px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .weui_dialog_ft a {
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #FE9B20;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .weui_dialog_ft a:active {
    background-color: #EEEEEE;
  }
  .weui_dialog_ft:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 2px solid #D5D5D6; /*px*/
    color: #D5D5D6;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .weui_btn_dialog.cancel {
    color: #8a8c92;
  }
  .weui_btn_dialog.primary {
    border-left: 2px solid #D5D5D6;
    color: #FE9B20;
  }
</style>

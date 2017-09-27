<template>
  <header class="location-bar">
    <strong :class="{placeholder: formattedAddress === '未获取到地理位置'}"><i></i>{{formattedAddress}}</strong>
    <button :disabled="btnDisabled" @click="getLocation()" type="button">
      <i class="icon-location"></i>
    </button>
  </header>
</template>

<script type="text/ecmascript-6">
  import { Wechat } from '../methods/Wechat'
  import store from '../vuex/store'

  export default {
    data () {
      return {
        btnDisabled: false
      }
    },
    computed: {
      formattedAddress () {
        return this.$store.getters.doneFormat
      }
    },
    methods: {
      getLocation () {
        this.btnDisabled = 'disabled'
        Wechat.getFormattedAddress()
        .then(() => {
          this.btnDisabled = false
        })
        .catch(() => {
          this.btnDisabled = false
        })
      }
    },
    store
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "../styles/base/_var";
  .icon {
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .icon-marker {
    background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxM3B4IiB2aWV3Qm94PSIwIDAgMTAgMTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzICgzODk5OSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl/lnLDlnYA8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5pyq6I635Y+W5Yiw5Zyw55CG5L2N572uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTUuMDAwMDAwLCAtNzkuMDAwMDAwKSIgZmlsbD0iIzAwMDAwMCI+CiAgICAgICAgICAgIDxnIGlkPSLlnLDlnYAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA2NC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xOCwxOS45OTk5MTg1IEMxOCwxOC44OTUwMjYzIDE4Ljg5NTY0MTUsMTggMjAsMTggQzIxLjEwNDM1ODUsMTggMjIsMTguODk1MDI2MyAyMiwxOS45OTk5MTg1IEMyMiwyMS4xMDQ0ODQ5IDIxLjEwNDM1ODUsMjIgMjAsMjIgQzE4Ljg5NTY0MTUsMjIgMTgsMjEuMTA0NDg0OSAxOCwxOS45OTk5MTg1IE0yNSwyMC4wNjQ2NjQgQzI1LDE3LjI2NzM0MjQgMjIuNzYxMTk0LDE1IDE5Ljk5OTc4NTMsMTUgQzE3LjIzODgwNiwxNSAxNSwxNy4yNjczNDI0IDE1LDIwLjA2NDY2NCBDMTUsMjIuODYyMTMwNSAxOS4xMTU4NTQxLDI4IDE5Ljk5OTc4NTMsMjggQzIwLjczNjMyMzIsMjggMjUsMjIuODYyMTMwNSAyNSwyMC4wNjQ2NjQgWiIgaWQ9Imljb25f5Zyw5Z2AIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==");
    @extend .icon;
  }
  .location-bar {
    background-color: #000;
    height: 76px;
    align-items: center;
    display: flex;
    padding-left: 30px;
    strong {
      font-weight: normal;
      display: block;
      align-self: center;
      flex: 1;
      padding-right: 30px;
      line-height: 1.5;
      font-size: 24px;
      color: #fff;
      &.placeholder {
        color: #8A8C92;
      }
    }
    button {
      display: block;
      border: none;
      background-color: transparent;
      color: $orange;
      padding: 6px 30px;
      height: 60px;
      line-height: 60px;
      .icon-location {
        font-size: 36px;
      }
      &:disabled {
        color: $midGray;
      }
    }
  }
</style>

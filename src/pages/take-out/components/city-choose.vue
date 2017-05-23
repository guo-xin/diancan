<template>
  <div v-show="visible" class="choose-city-wrap">
    <div>
      <div class="city-header">
        <i class="choose-back" @click="hideModal"></i>
        <h3>配送至</h3>
      </div>
      <ul class="area-wrap">
        <li :id="item.id" v-for="item in areaInfo" @click="getArea(item.id, item.name)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import config from '../../../methods/Config'
  export default {
    data () {
      return {
        areaInfo: [],
        level: 0,
        parent_id: 0,
        areaName: []
      }
    },
    props: ['visible'],
    methods: {
      init () {
        this.level = 0
        this.parent_id = 0
        this.areaInfo = []
        this.areaName = []
      },
      hideModal () {
        this.$dispatch('hideModal')
        this.init()
      },
      getArea (id, str) {
        this.areaName.push(str)
        if (this.level === 3) {
          this.$dispatch('gotAreaId', id, this.areaName)
          this.init()
          return
        }
        this.$http({
          url: config.dcHost + 'diancan/c/get_area',
          method: 'JSONP',
          data: {
            format: 'jsonp',
            parent_id: id
          }
        }).then(function (res) {
          if (res.data.respcd === '0000') {
            this.level++
            this.areaInfo = res.data.data.area_list
          }
        })
      }
    },
    events: {
      'getArea' () {
        this.$http({
          url: config.dcHost + 'diancan/c/get_area',
          method: 'JSONP',
          data: {
            format: 'jsonp',
            parent_id: this.parent_id
          }
        }).then(function (res) {
          if (res.data.respcd === '0000') {
            this.level++
            this.areaInfo = res.data.data.area_list
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/main";
  .choose-city-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    min-height: 100%;
    background-color: rgba(0, 0, 0, .5);
    > div {
      position: absolute;
      top: 0;
      right: 0;
      width: 9rem;
      height: 100%;
      overflow: scroll;
      background: $white;
      .city-header {
        height: 1.14rem;
        line-height: 1.14rem;
        border-bottom: .03rem solid $lightGray;
        top: 0;
        left: 1rem;
        right: 0;
        position: fixed;
        background-color: $white;
        z-index: 2000;
        h3 {
          text-align: center;
          font-size: $fr4;
        }
        i {
          position: absolute;
          left: .27rem;
          top: .27rem;
          display: block;
          width: .6rem;
          height: .6rem;
          background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEzcHgiIGhlaWdodD0iMjJweCIgdmlld0JveD0iMCAwIDEzIDIyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggQmV0YSAzLjUgKDI1MTI1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5iYWNrPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2ggQmV0YS48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4KICAgICAgICA8ZyBpZD0i6K6i5Y2V56Gu6K6kLeWcsOWdgC1jb3B5LTIiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMy4wMDAwMDAsIC0zMS4wMDAwMDApIiBmaWxsPSIjREVERURFIj4KICAgICAgICAgICAgPGcgaWQ9ImhlYWRlciIgc2tldGNoOnR5cGU9Ik1TTGF5ZXJHcm91cCI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iYmFjayIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMuMDAwMDAwLCAzMS41MDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMCwxMC41IEMwLDkuNzA5MTU5MDkgMC42NzE1LDkuMDY4MTgxODIgMS41LDkuMDY4MTgxODIgQzIuMzI4NSw5LjA2ODE4MTgyIDMsOS43MDkxNTkwOSAzLDEwLjUgQzMsMTEuMjkwODQwOSAyLjMyODUsMTEuOTMxODE4MiAxLjUsMTEuOTMxODE4MiBDMC42NzE1LDExLjkzMTgxODIgMCwxMS4yOTA4NDA5IDAsMTAuNSIgaWQ9IkZpbGwtNDEiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMC41LDkuNTI2MDc0NTUgTDIuNTQyNDQ0NDQsMTEuNDc1OTIxMyBMMTIuMDc1Mjk2MywyLjM3NTI1NzM5IEMxMi42Mzk1OTI2LDEuODM3MDA0MDcgMTIuNjM5NTkyNiwwLjk2MzY2MzkyNSAxMi4wNzUyOTYzLDAuNDI1NDEwNjA1IEMxMS41MTE0ODE1LC0wLjExMzMwMjM2NyAxMC41OTY2NjY3LC0wLjExMzMwMjM2NyAxMC4wMzI4NTE5LDAuNDI1NDEwNjA1IEwwLjUsOS41MjYwNzQ1NSBaIiBpZD0iRmlsbC00MiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMi4wNzUyOTYzLDE4LjY0NjExODUgTDIuNTQyNDQ0NDQsOS41NDU0NTQ1NSBMMC41LDExLjQ5NTMwMTMgTDEwLjAzMjg1MTksMjAuNTk1OTY1MyBDMTAuNTk2NjY2NywyMS4xMzQ2NzgyIDExLjUxMTQ4MTUsMjEuMTM0Njc4MiAxMi4wNzUyOTYzLDIwLjU5NTk2NTMgQzEyLjYzOTU5MjYsMjAuMDU3NzEyIDEyLjYzOTU5MjYsMTkuMTg0MzcxOCAxMi4wNzUyOTYzLDE4LjY0NjExODUiIGlkPSJGaWxsLTQzIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg%3D%3D") center center no-repeat;
          background-size: .6rem .6rem;
        }
      }
      ul {
        position: absolute;
        top: 1.14rem;
        left: 0;
        right: 0;
        li {
          height: 1rem;
          line-height: 1rem;
          padding-left: .4rem;
          font-size: $fr4;
          border-bottom: .03rem solid $lightGray;
          &.hover {
            background-color: $lightGray;
          }
        }
      }
    }
  }
</style>

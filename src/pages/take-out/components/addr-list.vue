<template>
  <div id="address-list">
    <div class="empty-address" @click.prevent="goAddAddress">
      <img src="../assets/btn_add.svg" alt="" class="address-add">新增配送地址
      <img src="../assets/btn_arrow.svg" alt="" class="address-arrow">
    </div>
    <ul class="address-list">
      <li id="{{id}}" v-for="item in addr" @click="goUpdate(item.addr_id)">
        <i :class="{'active': $index==0}"></i>
        <ul>
          <li>{{item.contact_name}} {{item.mobile}}</li>
          <li v-if="item.parent_area != ''">{{item.parent_area[0].name}} {{item.parent_area[1].name}} {{item.parent_area[2].name}}</li>
          <li>{{item.detail_addr}}</li>
        </ul>
        <a class="edit" @click.prevent.stop="goEdit(item.addr_id)"></a>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/main";
  @import "../scss/mixins";
  #address-list {
    padding-top: 20px;
  }
  @include empty-address;
  .empty-address {
    background-color: #fff;
    margin-left: 0;
    border-top: 2px solid #e5e5e5;
    padding-left: 30px;
  }
  .address-list {
    border-top: .03rem solid #e5e5e5;
    border-bottom: .03rem solid #e5e5e5;
    margin-top: 18px;
  > li {
      background: $white;
      padding: .2rem 0 .2rem .4rem;
      border-bottom: .03rem solid #e5e5e5;
  &:nth-last-of-type(1){
     border-bottom: none;
   }
  i {
    float: left;
    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMjFweCIgaGVpZ2h0PSIxNXB4IiB2aWV3Qm94PSIwIDAgMjEgMTUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+UGFnZSAxPC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPiAgICAgICAgPGcgaWQ9ImFkZHJlc3NfbGlzdC1jb3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTUuMDAwMDAwLCAtMTYwLjAwMDAwMCkiIHN0cm9rZT0iIzdFRDMyMSIgc3Ryb2tlLXdpZHRoPSIyIj4gICAgICAgICAgICA8cGF0aCBkPSJNMzUuMDM4NDE1MywxNjEuODc4NjU1IEwyNC4xNTk1MjY5LDE3My41NDUyMDMgQzIzLjc4NDAyODEsMTczLjk0Nzg4OSAyMy4xNzQ4NjQyLDE3My45NDc4ODkgMjIuNzk5MzY1NCwxNzMuNTQ1MjAzIEwxNiwxNjYuMjUzNTQ2IiBpZD0iUGFnZS0xIj48L3BhdGg+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=) no-repeat;
    display: none;
    width: .5333rem;
    height: .34666rem;
    background-size: 100% 100%;
    margin-top: .6rem;
    margin-right: .4rem;
  &.active {
     display: block;
   }
  }
  ul {
    float: left;
    max-width: 7.5rem;
  @include address-li;
  li:nth-child(3){
    max-width: 6.5rem;
  }
  }
  a {
    float: right;
    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMjVweCIgaGVpZ2h0PSIyM3B4IiB2aWV3Qm94PSIwIDAgMjUgMjMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+R3JvdXAgMjwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2ggQmV0YS48L2Rlc2M+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iYWRkcmVzc19saXN0LWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMzIuMDAwMDAwLCAtMTU3LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzMuMDAwMDAwLCAxNTcuMDAwMDAwKSI+ICAgICAgICAgICAgICAgIDxnIGlkPSJQYWdlLTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAwLjk1MjM4MSkiPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTMuNzAyODU3MTQsMjEuNzE0Mjg1NyBDMS42NjEzNDg1NywyMS43MTQyODU3IDAsMjAuMDUzMzQ4NiAwLDE4LjAxMTQyODYgTDAsMTcuNiBDMCwxNy4zNzI0OCAwLjE4NDMyLDE3LjE4ODU3MTQgMC40MTE0Mjg1NzEsMTcuMTg4NTcxNCBDMC42Mzg1MzcxNDMsMTcuMTg4NTcxNCAwLjgyMjg1NzE0MywxNy4zNzI0OCAwLjgyMjg1NzE0MywxNy42IEwwLjgyMjg1NzE0MywxOC4wMTE0Mjg2IEMwLjgyMjg1NzE0MywxOS41OTkxMzE0IDIuMTE0NzQyODYsMjAuODkxNDI4NiAzLjcwMjg1NzE0LDIwLjg5MTQyODYgTDE2Ljg2ODU3MTQsMjAuODkxNDI4NiBDMTguNDU2Mjc0MywyMC44OTE0Mjg2IDE5Ljc0ODU3MTQsMTkuNTk5MTMxNCAxOS43NDg1NzE0LDE4LjAxMTQyODYgTDE5Ljc0ODU3MTQsNC44NDU3MTQyOSBDMTkuNzQ4NTcxNCwzLjI1ODAxMTQzIDE4LjQ1NjI3NDMsMS45NjU3MTQyOSAxNi44Njg1NzE0LDEuOTY1NzE0MjkgTDMuNzAyODU3MTQsMS45NjU3MTQyOSBDMi4xMTQ3NDI4NiwxLjk2NTcxNDI5IDAuODIyODU3MTQzLDMuMjU4MDExNDMgMC44MjI4NTcxNDMsNC44NDU3MTQyOSBMMC44MjI4NTcxNDMsMTUuOTU0Mjg1NyBDMC44MjI4NTcxNDMsMTYuMTgxODA1NyAwLjYzODUzNzE0MywxNi4zNjU3MTQzIDAuNDExNDI4NTcxLDE2LjM2NTcxNDMgQzAuMTg0MzIsMTYuMzY1NzE0MyAwLDE2LjE4MTgwNTcgMCwxNS45NTQyODU3IEwwLDQuODQ1NzE0MjkgQzAsMi44MDM3OTQyOSAxLjY2MTM0ODU3LDEuMTQyODU3MTQgMy43MDI4NTcxNCwxLjE0Mjg1NzE0IEwxNi44Njg1NzE0LDEuMTQyODU3MTQgQzE4LjkxMDQ5MTQsMS4xNDI4NTcxNCAyMC41NzE0Mjg2LDIuODAzNzk0MjkgMjAuNTcxNDI4Niw0Ljg0NTcxNDI5IEwyMC41NzE0Mjg2LDE4LjAxMTQyODYgQzIwLjU3MTQyODYsMjAuMDUzMzQ4NiAxOC45MTA0OTE0LDIxLjcxNDI4NTcgMTYuODY4NTcxNCwyMS43MTQyODU3IEwzLjcwMjg1NzE0LDIxLjcxNDI4NTcgWiIgaWQ9IkZpbGwtMSIgc3Ryb2tlPSIjRkU5QjIwIiBzdHJva2Utd2lkdGg9IjAuMyIgZmlsbD0iI0ZFOUIyMCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS00NjUiIGZpbGw9IiNGRkZGRkYiIHg9IjE0Ljg1NzE0MjkiIHk9IjAiIHdpZHRoPSI5LjE0Mjg1NzE0IiBoZWlnaHQ9IjYuODU3MTQyODYiPjwvcmVjdD4gICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICAgICA8ZyBpZD0iUGFnZS0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjU3MTQyOSwgMC4wMDAwMDApIj4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjMzMDc3NjE5LDE2LjE5MjAwNzEgTDEuMDQ0NjA5NTIsMTcuMDUwNTA3MSBMMS45MDMxMDk1MiwxNi43NjQzNDA1IEwxNi40MzI0NDI5LDIuMjM1NDExOSBMMTUuODYwMTA5NSwxLjY2MjY3MzgxIEwxLjMzMDc3NjE5LDE2LjE5MjAwNzEgWiBNMC40MDQ2ODA5NTIsMTguMDk1MTk3NiBDMC4yOTkwMzgwOTUsMTguMDk1MTk3NiAwLjE5NTQxOTA0OCwxOC4wNTM5MTE5IDAuMTE4NTE0Mjg2LDE3Ljk3NjYwMjQgQzAuMDEwMDM4MDk1MiwxNy44Njg1MzEgLTAuMDI3NjA0NzYxOSwxNy43MDc4NDA1IDAuMDIwOTY2NjY2NywxNy41NjI1MzEgTDAuNTkzMywxNS44NDU1MzEgQzAuNjEzMTMzMzMzLDE1Ljc4NTYyNjIgMC42NDY3Mjg1NzEsMTUuNzMxMzg4MSAwLjY5MDg0NzYxOSwxNS42ODcyNjkgTDE1LjU3MzUzODEsMC44MDQxNzM4MSBDMTUuNzMxOCwwLjY0NjMxNjY2NyAxNS45ODgwMTQzLDAuNjQ2MzE2NjY3IDE2LjE0NjI3NjIsMC44MDQxNzM4MSBMMTcuMjkwOTQyOSwxLjk0OTI0NTI0IEMxNy40NDg4LDIuMTA3MTAyMzggMTcuNDQ4OCwyLjM2MzMxNjY3IDE3LjI5MDk0MjksMi41MjE1Nzg1NyBMMi40MDc4NDc2MiwxNy40MDQyNjkgQzIuMzYzNzI4NTcsMTcuNDQ4Mzg4MSAyLjMwOTQ5MDQ4LDE3LjQ4MjM4ODEgMi4yNDk5OTA0OCwxNy41MDE4MTY3IEwwLjUzMjU4NTcxNCwxOC4wNzQxNSBDMC40OTA4OTUyMzgsMTguMDg4NzIxNCAwLjQ0NzE4MDk1MiwxOC4wOTUxOTc2IDAuNDA0NjgwOTUyLDE4LjA5NTE5NzYgTDAuNDA0NjgwOTUyLDE4LjA5NTE5NzYgWiIgaWQ9IkZpbGwtMSIgc3Ryb2tlPSIjRkU5QjIwIiBzdHJva2Utd2lkdGg9IjAuMyIgZmlsbD0iI0ZFOUIyMCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Ljk1NzQ4ODEsMS41NjQ4OTA0OCBMMTYuNTMwMjI2MiwyLjEzNzYyODU3IEwxNi44MTYzOTI5LDEuODUxMDU3MTQgQzE2Ljk3NDI1LDEuNjkzMiAxNi45NzQyNSwxLjQzNjU4MDk1IDE2LjgxNTk4ODEsMS4yNzg3MjM4MSBDMTYuNjY1MDExOSwxLjEyNzc0NzYyIDE2LjM5NTg0NTIsMS4xMjc3NDc2MiAxNi4yNDQwNTk1LDEuMjc4NzIzODEgTDE1Ljk1NzQ4ODEsMS41NjQ4OTA0OCBaIE0xNi41MzAyMjYyLDMuMTE0NzIzODEgQzE2LjQyMjk2NDMsMy4xMTQ3MjM4MSAxNi4zMjAxNTQ4LDMuMDcyMjIzODEgMTYuMjQ0MDU5NSwyLjk5NjEyODU3IEwxNS4wOTg5ODgxLDEuODUxMDU3MTQgQzE1LjAyMjg5MjksMS43NzUzNjY2NyAxNC45ODAzOTI5LDEuNjcyMTUyMzggMTQuOTgwMzkyOSwxLjU2NDg5MDQ4IEMxNC45ODAzOTI5LDEuNDU3MjIzODEgMTUuMDIyODkyOSwxLjM1NDQxNDI5IDE1LjA5ODk4ODEsMS4yNzg3MjM4MSBMMTUuNjcxNzI2MiwwLjcwNjM5MDQ3NiBDMTYuMTI4NzAyNCwwLjI1MDIyMzgxIDE2LjkzMDk0MDUsMC4yNDkwMDk1MjQgMTcuMzg4NzI2MiwwLjcwNTk4NTcxNCBDMTcuODYxODkyOSwxLjE4MDM2NjY3IDE3Ljg2MTg5MjksMS45NTAyMjM4MSAxNy4zODg3MjYyLDIuNDIzMzkwNDggTDE2LjgxNjM5MjksMi45OTYxMjg1NyBDMTYuNzQwNzAyNCwzLjA3MjIyMzgxIDE2LjYzNzg5MjksMy4xMTQ3MjM4MSAxNi41MzAyMjYyLDMuMTE0NzIzODEgTDE2LjUzMDIyNjIsMy4xMTQ3MjM4MSBaIiBpZD0iRmlsbC0zIiBzdHJva2U9IiNGRTlCMjAiIHN0cm9rZS13aWR0aD0iMC4zIiBmaWxsPSIjRkU5QjIwIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuNjY2NjY3LCAwLjAwMDAwMCkiPjwvZz4gICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==) center center no-repeat;
    background-size: .64rem .64rem;
    width: 1.7066rem;
    height: 1.54666rem;
  //border-left: 0.03rem solid #e5e5e5;
  }
  &:after {
     content: "";
     display: block;
     clear: both;
   }
  }
  }
</style>
<script type="text/ecmascript-6">
  import config from '../../../methods/Config'
  export default {
    data () {
      return {
        cors: {
          format: 'cors'
        }
      }
    },
    computed: {
      addr () {
        return this.$root.addr
      }
    },
    route: {
      data (transition) {
        this.$http({
          url: config.dcHost + 'diancan/c/addr_list',
          method: 'JSONP',
          data: {
            format: 'jsonp'
          }
        }).then(function (res) {
          if (res.data.respcd === '0000') {
            this.$root.addr = res.data.data.addr_list
          }
        })
      }
    },
    methods: {
      goAddAddress () {
        this.$router.go({
          path: '/address/add'
        })
      },
      goUpdate (id) {
        var addrInfo = () => {
          for (var i = 0; i < this.addr.length; i++) {
            if (this.addr[i].addr_id === id) {
              return this.addr[i]
            }
          }
        }
        this.$http({
          url: config.dcHost + 'diancan/c/modify_addr',
          method: 'post',
          data: Object.assign(addrInfo(), this.cors)
        }).then(function (res) {
          if (res.data.respcd === '0000') {
            window.history.go(-1)
          }
        })
      },
      goEdit (id) {
        var addrInfo = () => {
          for (var i = 0; i < this.addr.length; i++) {
            if (this.addr[i].addr_id === id) {
              return this.addr[i]
            }
          }
        }
        this.$root.tempAddr = addrInfo()
        this.$router.go({name: 'addressUpdate'})
      }
    }
  }
</script>

<template>
  <div class="address-title" @click.prevent="goAddAddress">
    <img src="../assets/btn_add.svg"><span>新增配送地址</span>
  </div>
  <ul class="address-list">
    <li id="{{id}}" v-for="item in addr" @click="selectedAddr(item.addr_id)">
      <i class="checked-icon" :class="{'active': $index==0}"></i>
      <p>
        <span>{{item.contact_name}} {{item.mobile}}</span>
        <strong>{{item.location}} {{item.detail_addr}}</strong>
        <em v-if="item.overdist" class="warn-tip"><i></i>超出配送范围</em>
      </p>
      <a class="edit" @click.prevent.stop="goEdit(item.addr_id)"></a>
    </li>
  </ul>
</template>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/main";
  .address-title {
    height: 92px;
    line-height: 92px;
    background: #fff url("../assets/btn_arrow.svg") right 30px center no-repeat;
    background-size: 18px 34px;
    border-top: 2px solid $lightGray;
    border-bottom: 2px solid $lightGray;
    padding-left: 24px;
    margin-bottom: 18px;
    font-size: 30px;
    color: $black;
    img {
      width: 46px;
      height: 46px;
      margin-right: 20px;
    }
    img, span {
      vertical-align: middle;
    }
  }
  .address-list {
    border-top: 2px solid $lightGray;
    background-color: $white;
    margin-top: 18px;
    li {
      padding: 20px 30px;
      border-bottom: 2px solid $lightGray;
      display: flex;
      align-items: center;
    }
    p {
      flex: 1;
      line-height: 1.5;
      span {
        font-size: 28px;
        color: $lightBlack;
      }
      strong {
        font-weight: normal;
        display: block;
        font-size: 30px;
        color: $black;
      }
    }
    .checked-icon {
      width: 36px;
      height: 36px;
      margin-right: 26px;
      border-radius: 50%;
      border: 2px solid $lightGray;
      &.active {
        background: url("../assets/checked-icon.svg") center center no-repeat;
        background-size: contain;
        border-radius: inherit;
        border: none;
      }
    }
  }
  .edit {
    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iMjVweCIgaGVpZ2h0PSIyM3B4IiB2aWV3Qm94PSIwIDAgMjUgMjMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+R3JvdXAgMjwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2ggQmV0YS48L2Rlc2M+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iYWRkcmVzc19saXN0LWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMzIuMDAwMDAwLCAtMTU3LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMzMuMDAwMDAwLCAxNTcuMDAwMDAwKSI+ICAgICAgICAgICAgICAgIDxnIGlkPSJQYWdlLTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAwLjk1MjM4MSkiPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTMuNzAyODU3MTQsMjEuNzE0Mjg1NyBDMS42NjEzNDg1NywyMS43MTQyODU3IDAsMjAuMDUzMzQ4NiAwLDE4LjAxMTQyODYgTDAsMTcuNiBDMCwxNy4zNzI0OCAwLjE4NDMyLDE3LjE4ODU3MTQgMC40MTE0Mjg1NzEsMTcuMTg4NTcxNCBDMC42Mzg1MzcxNDMsMTcuMTg4NTcxNCAwLjgyMjg1NzE0MywxNy4zNzI0OCAwLjgyMjg1NzE0MywxNy42IEwwLjgyMjg1NzE0MywxOC4wMTE0Mjg2IEMwLjgyMjg1NzE0MywxOS41OTkxMzE0IDIuMTE0NzQyODYsMjAuODkxNDI4NiAzLjcwMjg1NzE0LDIwLjg5MTQyODYgTDE2Ljg2ODU3MTQsMjAuODkxNDI4NiBDMTguNDU2Mjc0MywyMC44OTE0Mjg2IDE5Ljc0ODU3MTQsMTkuNTk5MTMxNCAxOS43NDg1NzE0LDE4LjAxMTQyODYgTDE5Ljc0ODU3MTQsNC44NDU3MTQyOSBDMTkuNzQ4NTcxNCwzLjI1ODAxMTQzIDE4LjQ1NjI3NDMsMS45NjU3MTQyOSAxNi44Njg1NzE0LDEuOTY1NzE0MjkgTDMuNzAyODU3MTQsMS45NjU3MTQyOSBDMi4xMTQ3NDI4NiwxLjk2NTcxNDI5IDAuODIyODU3MTQzLDMuMjU4MDExNDMgMC44MjI4NTcxNDMsNC44NDU3MTQyOSBMMC44MjI4NTcxNDMsMTUuOTU0Mjg1NyBDMC44MjI4NTcxNDMsMTYuMTgxODA1NyAwLjYzODUzNzE0MywxNi4zNjU3MTQzIDAuNDExNDI4NTcxLDE2LjM2NTcxNDMgQzAuMTg0MzIsMTYuMzY1NzE0MyAwLDE2LjE4MTgwNTcgMCwxNS45NTQyODU3IEwwLDQuODQ1NzE0MjkgQzAsMi44MDM3OTQyOSAxLjY2MTM0ODU3LDEuMTQyODU3MTQgMy43MDI4NTcxNCwxLjE0Mjg1NzE0IEwxNi44Njg1NzE0LDEuMTQyODU3MTQgQzE4LjkxMDQ5MTQsMS4xNDI4NTcxNCAyMC41NzE0Mjg2LDIuODAzNzk0MjkgMjAuNTcxNDI4Niw0Ljg0NTcxNDI5IEwyMC41NzE0Mjg2LDE4LjAxMTQyODYgQzIwLjU3MTQyODYsMjAuMDUzMzQ4NiAxOC45MTA0OTE0LDIxLjcxNDI4NTcgMTYuODY4NTcxNCwyMS43MTQyODU3IEwzLjcwMjg1NzE0LDIxLjcxNDI4NTcgWiIgaWQ9IkZpbGwtMSIgc3Ryb2tlPSIjRkU5QjIwIiBzdHJva2Utd2lkdGg9IjAuMyIgZmlsbD0iI0ZFOUIyMCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS00NjUiIGZpbGw9IiNGRkZGRkYiIHg9IjE0Ljg1NzE0MjkiIHk9IjAiIHdpZHRoPSI5LjE0Mjg1NzE0IiBoZWlnaHQ9IjYuODU3MTQyODYiPjwvcmVjdD4gICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICAgICA8ZyBpZD0iUGFnZS0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjU3MTQyOSwgMC4wMDAwMDApIj4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjMzMDc3NjE5LDE2LjE5MjAwNzEgTDEuMDQ0NjA5NTIsMTcuMDUwNTA3MSBMMS45MDMxMDk1MiwxNi43NjQzNDA1IEwxNi40MzI0NDI5LDIuMjM1NDExOSBMMTUuODYwMTA5NSwxLjY2MjY3MzgxIEwxLjMzMDc3NjE5LDE2LjE5MjAwNzEgWiBNMC40MDQ2ODA5NTIsMTguMDk1MTk3NiBDMC4yOTkwMzgwOTUsMTguMDk1MTk3NiAwLjE5NTQxOTA0OCwxOC4wNTM5MTE5IDAuMTE4NTE0Mjg2LDE3Ljk3NjYwMjQgQzAuMDEwMDM4MDk1MiwxNy44Njg1MzEgLTAuMDI3NjA0NzYxOSwxNy43MDc4NDA1IDAuMDIwOTY2NjY2NywxNy41NjI1MzEgTDAuNTkzMywxNS44NDU1MzEgQzAuNjEzMTMzMzMzLDE1Ljc4NTYyNjIgMC42NDY3Mjg1NzEsMTUuNzMxMzg4MSAwLjY5MDg0NzYxOSwxNS42ODcyNjkgTDE1LjU3MzUzODEsMC44MDQxNzM4MSBDMTUuNzMxOCwwLjY0NjMxNjY2NyAxNS45ODgwMTQzLDAuNjQ2MzE2NjY3IDE2LjE0NjI3NjIsMC44MDQxNzM4MSBMMTcuMjkwOTQyOSwxLjk0OTI0NTI0IEMxNy40NDg4LDIuMTA3MTAyMzggMTcuNDQ4OCwyLjM2MzMxNjY3IDE3LjI5MDk0MjksMi41MjE1Nzg1NyBMMi40MDc4NDc2MiwxNy40MDQyNjkgQzIuMzYzNzI4NTcsMTcuNDQ4Mzg4MSAyLjMwOTQ5MDQ4LDE3LjQ4MjM4ODEgMi4yNDk5OTA0OCwxNy41MDE4MTY3IEwwLjUzMjU4NTcxNCwxOC4wNzQxNSBDMC40OTA4OTUyMzgsMTguMDg4NzIxNCAwLjQ0NzE4MDk1MiwxOC4wOTUxOTc2IDAuNDA0NjgwOTUyLDE4LjA5NTE5NzYgTDAuNDA0NjgwOTUyLDE4LjA5NTE5NzYgWiIgaWQ9IkZpbGwtMSIgc3Ryb2tlPSIjRkU5QjIwIiBzdHJva2Utd2lkdGg9IjAuMyIgZmlsbD0iI0ZFOUIyMCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Ljk1NzQ4ODEsMS41NjQ4OTA0OCBMMTYuNTMwMjI2MiwyLjEzNzYyODU3IEwxNi44MTYzOTI5LDEuODUxMDU3MTQgQzE2Ljk3NDI1LDEuNjkzMiAxNi45NzQyNSwxLjQzNjU4MDk1IDE2LjgxNTk4ODEsMS4yNzg3MjM4MSBDMTYuNjY1MDExOSwxLjEyNzc0NzYyIDE2LjM5NTg0NTIsMS4xMjc3NDc2MiAxNi4yNDQwNTk1LDEuMjc4NzIzODEgTDE1Ljk1NzQ4ODEsMS41NjQ4OTA0OCBaIE0xNi41MzAyMjYyLDMuMTE0NzIzODEgQzE2LjQyMjk2NDMsMy4xMTQ3MjM4MSAxNi4zMjAxNTQ4LDMuMDcyMjIzODEgMTYuMjQ0MDU5NSwyLjk5NjEyODU3IEwxNS4wOTg5ODgxLDEuODUxMDU3MTQgQzE1LjAyMjg5MjksMS43NzUzNjY2NyAxNC45ODAzOTI5LDEuNjcyMTUyMzggMTQuOTgwMzkyOSwxLjU2NDg5MDQ4IEMxNC45ODAzOTI5LDEuNDU3MjIzODEgMTUuMDIyODkyOSwxLjM1NDQxNDI5IDE1LjA5ODk4ODEsMS4yNzg3MjM4MSBMMTUuNjcxNzI2MiwwLjcwNjM5MDQ3NiBDMTYuMTI4NzAyNCwwLjI1MDIyMzgxIDE2LjkzMDk0MDUsMC4yNDkwMDk1MjQgMTcuMzg4NzI2MiwwLjcwNTk4NTcxNCBDMTcuODYxODkyOSwxLjE4MDM2NjY3IDE3Ljg2MTg5MjksMS45NTAyMjM4MSAxNy4zODg3MjYyLDIuNDIzMzkwNDggTDE2LjgxNjM5MjksMi45OTYxMjg1NyBDMTYuNzQwNzAyNCwzLjA3MjIyMzgxIDE2LjYzNzg5MjksMy4xMTQ3MjM4MSAxNi41MzAyMjYyLDMuMTE0NzIzODEgTDE2LjUzMDIyNjIsMy4xMTQ3MjM4MSBaIiBpZD0iRmlsbC0zIiBzdHJva2U9IiNGRTlCMjAiIHN0cm9rZS13aWR0aD0iMC4zIiBmaWxsPSIjRkU5QjIwIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQuNjY2NjY3LCAwLjAwMDAwMCkiPjwvZz4gICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==) center center no-repeat;
    background-size: contain;
    width: 48px;
    height: 48px;
  }
  .warn-tip {
    color: #E73B48;
    font-size: 24px;
    i {
      display: inline-block;
      width: 26px;
      height: 26px;
      margin-right: 8px;
      vertical-align: text-bottom;
      background: url("../assets/triangle.svg") center center no-repeat;
      background-size: contain;
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
            format: 'jsonp',
            userid: this.$route.query.mchnt_id
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
      selectAddr (id, overdist) {
        this.currentAddrId = id
        if (overdist) {
          this.visibleConfirm = true
        } else {
          this.selectedAddr()
        }
      },
      selectedAddr (id) {
        this.$http({
          url: config.dcHost + 'diancan/c/modify_addr',
          method: 'post',
          data: Object.assign({'addr_id': id}, this.cors)
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

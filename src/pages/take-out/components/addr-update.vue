<template>
  <form action="" id="user-info">
    <ul>
      <li>
        <span>联系人</span>
        <input type="text" v-model="info.contact_name" placeholder="你的姓名"/>
      </li>
      <li>
        <span>联系电话</span>
        <input type="text" id="mobile" v-model="info.mobile" placeholder="你的手机号" maxlength="11"/>
      </li>
      <li class="choose-city" @click="goChoose">
        <span>配送地址</span>
        <em>{{info.location}}</em>
        <input type="hidden" v-model="info.longitude"/>
        <input type="hidden" v-model="info.latitude"/>
      </li>
      <li>
        <span>详细门牌号</span>
        <input type="text" placeholder="填写详细门牌号" v-model="info.detail_addr"/>
      </li>
    </ul>
    <a @click.prevent="goAdd" class="save">保存</a>
    <a @click.prevent="confirm" class="delete">删除地址</a>
  </form>
  <confirm :visible.sync="visibleConfirm" title="确定删除地址？" confirm-event="on-deleteAddr"></confirm>
</template>
<script>
  import config from '../../../methods/Config'
  import confirm from '../../../components/confirm/confirm'
  export default {
    components: {confirm},
    data () {
      return {
        info: {
          contact_name: '',
          mobile: '',
          detail_addr: '',
          location: '',
          longitude: 0,
          latitude: 0,
          adcode: 0
        },
        cors: {
          format: 'cors'
        },
        visibleConfirm: false
      }
    },
    route: {
      data (transition) {
        Object.assign(this.info, this.$root.tempAddr)
        let viewport = document.querySelector('meta[name=viewport]')
        let m = document.createElement('meta')
        m.setAttribute('name', 'viewport')
        m.setAttribute('content', viewport.getAttribute('content'))
        viewport.parentNode.insertBefore(m, viewport.nextSibling)
        viewport.parentNode.removeChild(viewport)
        transition.next()
      }
    },
    methods: {
      goChoose () {
        this.$root.tempAddr = this.info
        let longitude = window.localStorage.getItem('longitude')
        let latitude = window.localStorage.getItem('latitude')
        let src = ''
        if (longitude && latitude) {
          src = `https://m.amap.com/picker/?center=${longitude},${latitude}&key=608d75903d29ad471362f8c58c550daf`
        } else {
          src = 'https://m.amap.com/picker/?key=608d75903d29ad471362f8c58c550daf'
        }
        this.$router.go({
          name: 'addressMarker',
          query: {
            src: src
          }
        })
      },
      goAdd () {
        const mobileReg = /^\d{11}$/
        if (!this.info.mobile.match(mobileReg)) {
          this.$dispatch('on-toast', '请输入正确的手机号!')
          return false
        }
        this.$http({
          url: config.dcHost + 'diancan/c/modify_addr',
          method: 'POST',
          data: Object.assign(this.info, this.cors)
        }).then(function (res) {
          if (res.data.respcd === '0000') {
            window.history.go(-1)
          }
        })
      },
      confirm () {
        this.visibleConfirm = true
      },
      goDelete () {
        this.$http({
          url: config.dcHost + 'diancan/c/delete_addr',
          method: 'POST',
          data: Object.assign({addr_id: this.info.addr_id}, this.cors)
        }).then(function (res) {
          if (res.data.respcd === '0000') {
            window.history.go(-1)
          }
        })
      }
    },
    events: {
      'on-deleteAddr' () {
        this.goDelete()
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/main";
  #user-info {
    padding-top: 30px;
  }
  ul {
    background-color: $white;
    padding-left: .4rem;
    border-top: 0.03rem solid #e5e5e5;
    border-bottom: 0.03rem solid #e5e5e5;
    margin-bottom: 40px;
    li {
      padding-right: .4rem;
      color: $lightBlack;
      font-size: .4rem;
      border-bottom: .03rem solid #E5E5E5;
      &:nth-last-of-type(1) {
        border-bottom: none;
      }
      &.choose-city {
        background: #fff url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwcHgiIGhlaWdodD0iMTdweCIgdmlld0JveD0iMCAwIDEwIDE3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggQmV0YSAzLjUgKDI1MTI1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5idG5fYXJyb3dAM3g8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaCBCZXRhLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSLorqLljZXnoa7orqQiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNTAuMDAwMDAwLCAtOTIuMDAwMDAwKSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2U9IiNBN0E5QUUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgICAgICA8ZyBpZD0iYWRkX2FkZHJlc3MiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA3OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJidG5fYXJyb3ciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1NS41MDAwMDAsIDIyLjUwMDAwMCkgcm90YXRlKC0xODAuMDAwMDAwKSB0cmFuc2xhdGUoLTM1NS41MDAwMDAsIC0yMi41MDAwMDApIHRyYW5zbGF0ZSgzNTEuMDAwMDAwLCAxNC4wMDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOC45MDI4Mjc5LDAuNjI0Mzk4NzUgTDAuOTAyODI3ODk4LDguNjI2Mjk4NzUgTDguOTAyODI3OSwxNi42MjcyOTg4IiBpZD0iUGFnZS0xIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg%3D%3D") 8.5rem center no-repeat;
        background-size: .6rem .6rem;
        em {
          display: inline-block;
          width: 6.5rem;
          font-size: 30px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-style: normal;
          color: $black;
          vertical-align: middle;
        }
      }
      span, input {
        vertical-align: middle;
      }
      span {
        display: inline-block;
        padding: 24px 0;
        width: 2.1333rem;
        color: $black;
      }
      input {
        border: none;
        font-size: $fr3;
        padding: 24px 0;
        width: 6.5rem;
      }
    }
  }

  a {
    display: block;
    width: 9.2rem;
    margin: 0 auto .4rem;
    text-align: center;
    font-size: .45333rem;
    height: 1.173rem;
    line-height: 1.173rem;
    border-radius: .08rem;
    &.save {
      color: $white;
      background-color: $orange;
    }
    &.delete {
      background-color: transparent;
      color: $orange;
      border: .03rem solid $orange;
    }
  }
</style>

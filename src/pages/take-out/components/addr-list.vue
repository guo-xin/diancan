<template>
  <div>
    <div class="address-title" @click.prevent="goAddAddress">
      <img src="../assets/btn_add.svg"><span>新增配送地址</span>
    </div>
    <ul class="address-list">
      <li v-for="(item, index) in addressList" @click="selectedAddr(item.addr_id)">
        <i class="checked-icon" :class="{'active': index === 0}"></i>
        <p>
          <span>{{item.contact_name}} {{item.mobile}}</span>
          <strong>{{item.location}} {{item.detail_addr}}</strong>
          <em v-if="!item.longitude" class="update-tip">需要升级地址</em>
          <em v-if="item.longitude && item.overdist" class="warn-tip"><i></i>超出配送范围</em>
        </p>
        <a v-if="item.longitude" class="touch-btn" @click.prevent.stop="goEdit(item.addr_id)"><i class="icon-edit"></i></a>
        <a v-else class="touch-btn" @click.prevent.stop="goUpdate(item.addr_id)"><i class="icon-update"></i></a>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  import config from 'methods/Config'
  export default {
    data () {
      return {
        addressList: [],
        cors: {
          format: 'cors'
        }
      }
    },
    created () {
      this.fetchData()
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        this.$http({
          url: `${config.dcHost}diancan/c/addr_list`,
          method: 'JSONP',
          params: {
            format: 'jsonp',
            userid: sessionStorage.getItem('mchntId')
          }
        }).then((res) => {
          if (res.data.respcd === '0000') {
            this.addressList = res.data.data.addr_list
          }
        })
      },
      goAddAddress () {
        this.$router.push({
          path: '/address/add'
        })
      },
      selectedAddr (id) {
        this.$http({
          url: config.dcHost + 'diancan/c/modify_addr',
          method: 'post',
          params: Object.assign({'addr_id': id}, this.cors)
        }).then(function (res) {
          if (res.data.respcd === '0000') {
            window.history.go(-1)
          }
        })
      },
      goEdit (id) {
        var addrInfo = () => {
          for (var i = 0; i < this.addressList.length; i++) {
            if (this.addressList[i].addr_id === id) {
              return this.addressList[i]
            }
          }
        }
        this.$parent.tempAddr = addrInfo()
        this.$router.push({name: 'addressUpdate'})
      },
      goUpdate (id) {
        var addrInfo = () => {
          for (var i = 0; i < this.addressList.length; i++) {
            if (this.addressList[i].addr_id === id) {
              return this.addressList[i]
            }
          }
        }
        this.$parent.tempAddr = addrInfo()
        this.$router.push({
          name: 'addressMarker',
          param: {
            from: 'addressList'
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../../styles/base/_var";
  @import "../../../styles/iconfont/iconfont.css";
  .address-title {
    height: 92px;
    line-height: 92px;
    background: #fff url("../assets/btn_arrow.svg") right 30px center no-repeat;
    background-size: 18px 34px;
    border-top: 2px solid $lightGray;
    border-bottom: 2px solid $lightGray;
    padding-left: 24px;
    margin-top: 18px;
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
  .touch-btn {
    width: 60px;
    height: 42px;
    margin-right: -9px;
    text-align: center;
    background-position:center center;
    background-repeat: no-repeat;
    background-size: contain;
    i {
      color: $orange;
      font-size: 42px;
    }
  }
  .update-tip {
    color: #06B390;
    font-size: 24px;
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

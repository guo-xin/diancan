import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    formatted_address: '未获取到地理位置',
    carts: [],
    cartsCount: 0
  },
  getters: {
    doneFormat: state => {
      return state.formatted_address
    },
    getCarts: state => {
      return state.carts
    }
  },
  mutations: {
    UPDATEADDRESS (state, formattedAddress) {
      state.formatted_address = formattedAddress
    },
    ADDCARTS (state, cart) {
      state.carts.push(cart)
    },
    UPDATECARTCOUNT (state, item) {
      state.carts[item.index].count = item.count
    },
    CLEANCARTS (state) {
      state.carts = []
    }
  }
})

export default store

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    formatted_address: '未获取到地理位置'
  },
  getters: {
    doneFormat: state => {
      return state.formatted_address
    }
  },
  mutations: {
    UPDATEADDRESS (state, formattedAddress) {
      state.formatted_address = formattedAddress
    }
  }
})

export default store

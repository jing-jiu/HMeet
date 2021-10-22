import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    meet: {},
    userInfo: {

    },
    socket: null
  },
  mutations: {
    saveMeet(state, meet) {
      state.meet = meet;
    },
    saveSocket(state, socket) {
      state.socket = socket;
    },
    saveUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  actions: {
  },
  modules: {
  }
})

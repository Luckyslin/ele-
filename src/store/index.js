import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
// 1. 导入 vuex 的插件自动存储token到localStorage
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    user
  }
})

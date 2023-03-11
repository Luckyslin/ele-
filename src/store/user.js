import axios from 'axios'
export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },
  mutations: {
    // 更新 token 的 mutation 函数
    updateToken(state, payload) {
      state.token = payload.token
    },
    // 更新用户基本信息的 mutation 函数
    userInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    // 调用接口，请求用户的基本信息
    async initUser(ctx) {
      const { data: res } = await axios.get('/my/userinfo')
      if (res.code === 0) {
        ctx.commit('userInfo', res.data)
        console.log(res.data)
      }
    }

  },
  getters: {

  }

}

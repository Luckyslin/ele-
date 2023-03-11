import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/assets/global.less'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  config.headers.Authorization = store.state.user.token
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const message = response.data.message
  if (message === '发布文章成功！') {
    ElementUI.Message.success(message)
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    store.commit('user/upDatetoken', [''])
    router.push('/login')
    Vue.prototype.$message.error(error.response.data.message)
  }
  return Promise.reject(error)
})
Vue.prototype.$axios = axios

Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

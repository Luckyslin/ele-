const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  configureWebpack: {
    externals: {
    // import导包的包名: window全局的成员名称
      echarts: 'echarts',
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      'vue-quill-editor': 'VueQuillEditor',
      'vuex-persistedstate': 'createPersistedState',
      axios: 'axios',
      dayjs: 'dayjs',
      'vue-router': 'VueRouter',
      vuex: 'Vuex'

    }
  }
})

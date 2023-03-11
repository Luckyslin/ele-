<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
             <img v-if="userInfo.user_pic" :src=" userInfo.user_pic" alt="" class="avatar" />
    <img v-else src="../../assets/logo.png" alt="" class="avatar" />

            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item @click="logout" index="2"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 左侧边栏区域 -->
<el-aside width="200px">
  <div class="user-box">
    <img v-if="userInfo.user_pic" :src=" userInfo.user_pic" alt="" />
    <img v-else src="../../assets/logo.png" alt="" />
    <span>欢迎  {{ userInfo.nickname || userInfo.username }}</span>
    <!-- 侧边栏导航 -->
  </div>
    <el-menu
          :router="true"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <template v-for="item in menu">
            <!-- v-if循环创建 -->
            <el-menu-item
              v-if="!item.children"
              :index="item.indexPath"
              :key="item.indexPath"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>

            <el-submenu v-else :index="item.indexPath" :key="item.indexPath">
                <!-- el-submenu需要用插槽渲染标题 -->
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
                <!-- 循环渲染“二级菜单” -->
              <el-menu-item
                :index="items.indexPath"
                v-for="items in item.children"
                :key="items.indexPath"
              >
                <i :class="items.icon"></i>
                {{ items.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
</el-aside>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
         <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Main',
  data() {
    return {
      menu: []
    }
  },
  created() {
    // 调用方法发送axios请求存储到vuex中
    this.$store.dispatch('user/initUser')
    // 调用方法发送axios获取侧边栏导航
    this.initmenu()
  },
  methods: {
    // 退出登录
    logout() {
      this.$confirm('此操作将退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success'
        })
        this.$message.success('退出登录成功')
        this.$router.push('/login')
        this.$store.commit('user/updateToken', '')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 获取侧边栏导航
    async initmenu() {
      const { data: res } = await this.$axios.get('/my/menus')
      if (res.code === 0) {
        this.menu = res.data
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
    overflow: hidden;
  }
}
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

// 全局重置 element-ui 组件库的基础样式
.el-input__inner,
.el-button,
.el-link,
.el-menu-item,
.el-submenu__title {
  font-size: 12px;
}

.el-menu.el-menu--horizontal {
  height: 60px;
  border-bottom: none;
}
</style>

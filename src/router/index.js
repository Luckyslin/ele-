import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import store from '@/store'
const login = () => import('../views/login/login')
const reg = () => import('../views/Reg/Reg')
const Main = () => import('../views/Main/main')
const Home = () => import('../views/menus/home/home')
const userInfo = () => import('../views/menus/user/userinfo')
const userAvatar = () => import('../views/menus/user/userAvatar')
const userPwd = () => import('../views/menus/user/userPwd')
const ArtCate = () => import('../views/menus/article/ArtCate')
const artList = () => import('../views/menus/article/artList')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: Home
      },
      {
        path: '/user-info',
        component: userInfo
      },
      {
        path: '/user-avatar',
        component: userAvatar
      },
      {
        path: '/user-pwd',
        component: userPwd
      }, {
        path: '/art-cate',
        component: ArtCate
      }, {
        path: '/art-List',
        component: artList
      }

    ]
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/reg',
    component: reg
  },
  {
    path: '/main',
    component: Main
  }

  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (!store.state.user.token && to.path !== '/reg' && to.path !== '/login') {
    console.log(ElementUI)
    ElementUI.Message.error('请先登录')
    return next('/login')
  } else {
    next()
  }
})
export default router

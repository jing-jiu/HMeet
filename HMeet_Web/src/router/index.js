import Vue from 'vue'
import VueRouter from 'vue-router'
// 登陆 注册 找回密码相关页面
import Login from '@/views/login/Login.vue'
import Forget from '@/views/login/Forget.vue'
import Reset from '@/views/login/Reset.vue'

// 主页相关页面
import Home from '@/views/home/Home.vue'
import QuicklyMeet from '@/views/home/QuicklyMeet.vue'
import ReserveMeet from '@/views/home/ReserveMeet.vue'
import JoinMeet from '@/views/home/JoinMeet.vue'
import Meet from '@/views/home/Meet.vue'
import UserInfo from '@/views/home/UserInfo.vue'
import History from '@/views/home/History.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'home'
  },
  // 登陆 注册 找回密码路由
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/forget',
    name: 'Forget',
    component: Forget,
  },
  {
    path: '/reset',
    name: 'Reset',
    component: Reset,
  },
  // 主页
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/home/joinMeet',
    name: 'JoinMeet',
    component: JoinMeet,
  },
  {
    path: '/home/quicklyMeet',
    name: 'QuicklyMeet',
    component: QuicklyMeet,
  },
  {
    path: '/home/reserveMeet',
    name: 'ReserveMeet',
    component: ReserveMeet,
  },
  {
    path: '/home/meet',
    name: 'Meet',
    component: Meet,
  },
  {
    path: '/home/info',
    name: 'UserInfo',
    component: UserInfo,
  },
  {
    path: '/home/history',
    name: 'History',
    component: History,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/forget' || to.path === '/reset') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router

import Vue from 'vue'
import Router from 'vue-router'

const Home = r => require.ensure([], () => r(require('@/pages/Home.vue')), 'Home')
const About = r => require.ensure([], () => r(require('@/pages/About.vue')), 'About')
const REPO = r => require.ensure([], () => r(require('@/pages/REPO.vue')), 'REPO')

Vue.use(Router)

let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: About,
      alias: '/'
    },
    {
      path: '/usdt',
      name: 'USDT',
      component: Home,
    },
    {
      path: '/repo',
      name: 'REPO',
      component: REPO
    }
  ]
})

export default router

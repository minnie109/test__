// ./router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import home from '@/home.vue'
//import home from 'C:/Vue/SmartHome/src/home.vue'


const routes = [
  { path: '/', component: home },
  //{ path: '/home', component: home },
 

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

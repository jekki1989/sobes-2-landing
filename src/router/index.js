import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import LoginStub from '../views/LoginStub.vue'
import RegisterStub from '../views/RegisterStub.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Landing },
    { path: '/login', component: LoginStub },
    { path: '/register', component: RegisterStub },
  ],
})

export default router

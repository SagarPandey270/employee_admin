import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import UserManagement from '../components/UserManagement.vue';

const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/users', name: 'UserManagement', component: UserManagement },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

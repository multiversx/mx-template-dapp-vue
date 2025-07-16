import './assets/main.css';
import { getIsLoggedIn } from '@multiversx/sdk-dapp/out/methods/account/getIsLoggedIn';
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

const routes = [
  {
    path: '/',
    component: () => import('./components/HomePage.vue'),
    meta: { requireAuth: false },
  },
  {
    path: '/dashboard',
    component: () => import('./components/DashboardPage.vue'),
    meta: { requireAuth: true },
  },
  {
    path: '/disclaimer',
    component: () => import('./components/DisclaimerPage.vue'),
    meta: { requireAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add authentication guard similar to React and Angular versions
router.beforeEach((to, from, next) => {
  const isLoggedIn = getIsLoggedIn();
  const requireAuth = to.meta?.requireAuth || false;

  // If logged in and trying to access a non-auth route, redirect to dashboard
  if (isLoggedIn && !requireAuth) {
    next('/dashboard');
    return;
  }

  // If not logged in and trying to access an auth-required route, redirect to home
  if (!isLoggedIn && requireAuth) {
    next('/');
    return;
  }

  next();
});

const config = {
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.devnet,
    successfulToastLifetime: 5000,
  },
};

initApp(config).then(() => {
  createApp(App).use(router).mount('#app');
});

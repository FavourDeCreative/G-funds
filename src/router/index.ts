import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { supabase } from '../lib/supabase'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      guestOnly: true,
    },
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: {
      guestOnly: true,
    },
  },

  {
    path: '/market',
    name: 'market',
    component: () => import('../views/Market.vue'),
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPassword.vue'),
    meta: {
      guestOnly: true,
    },
  },

  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../views/ResetPassword.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/*
 * Authentication Guard
 *
 * Runs before every route change.
 */
router.beforeEach(async (to) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  /*
   * Protected page
   *
   * User must be logged in.
   */
  if (to.meta.requiresAuth && !session) {
    return {
      name: 'login',
    }
  }

  /*
   * Guest-only pages
   *
   * Logged-in users don't need to access
   * login/register/forgot-password.
   */
  if (to.meta.guestOnly && session) {
    return {
      name: 'dashboard',
    }
  }

  /*
   * Everything is okay.
   */
  return true
})

export default router
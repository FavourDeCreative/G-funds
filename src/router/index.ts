import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      guestOnly: true,
    },
  },

  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
    meta: {
      guestOnly: true,
    },
  },

  {
    path: "/market",
    name: "market",
    component: () => import("../views/Market.vue"),
  },

  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },

  {
    path: "/faq",
    name: "faq",
    component: () => import("../views/FAQ.vue"),
  },

  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("../views/ForgotPassword.vue"),
    meta: {
      guestOnly: true,
    },
  },

  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../views/ResetPassword.vue"),
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  // Protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: "login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  // Guest-only routes
  if (to.meta.guestOnly && isAuthenticated) {
    return {
      name: "dashboard",
    };
  }

  return true;
});

export default router;

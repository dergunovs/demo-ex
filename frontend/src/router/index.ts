import {createRouter, createWebHistory} from "vue-router";
import {isAdmin, isAuth} from "../auth/index";
import {URLS} from "../constants/index";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({top: 0}),
  routes: [
    {path: URLS.home, name: "home", component: () => import("../pages/HomePage.vue")},
    {path: URLS.login, name: "login", component: () => import("../pages/LoginPage.vue")},
    {path: URLS.register, name: "register", component: () => import("../pages/RegisterPage.vue")},
    {
      path: URLS.account,
      name: "account",
      component: () => import("../pages/AccountPage.vue"),
      meta: {isPrivate: true},
    },
    {
      path: URLS.order,
      name: "order",
      component: () => import("../pages/OrderPage.vue"),
      meta: {isPrivate: true},
    },
    {
      path: URLS.admin,
      name: "admin",
      component: () => import("../pages/AdminPage.vue"),
      meta: {isPrivate: true, isAdminOnly: true},
    },
    {path: "/:pathMatch(.*)*", redirect: URLS.home},
  ],
});

router.beforeEach((to) => {
  if (to.meta.isPrivate && !isAuth.value) {
    return {path: URLS.login, query: {redirect: to.path}};
  }

  if (to.meta.isAdminOnly && !isAdmin.value) {
    return {path: URLS.account};
  }

  return true;
});

export default router;

import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";

import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Home from "@/components/Home";
import listActive from "@/components/listActive";
import listEdit from "@/components/listEdit";
import listAdd from "@/components/listAdd";
import stats from "@/components/stats";

import accountSettings from "@/components/accountSettings";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      alias: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/account/:id",
      name: "account",
      component: accountSettings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/edit/:id",
      name: "edit",
      component: listEdit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/add/:id",
      name: "add",
      component: listAdd,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/active/:id",
      name: "active",
      component: listActive,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/stats/:id",
      name: "stats",
      component: stats
    },
    {
      path: "/login",
      alias: "/login/:email",
      name: "login",
      component: Login
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "*",
      redirect: "/login",
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  // if (to.path === "/login") {
  //   next();
  //   return;
  // }
  if (to.path === "/" || to.path === "/home") {
    next();
    return;
  }

  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) {
    // alert("je moet eerst inloggen voor deze pagina");
    next("login");
  } else if (!requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;

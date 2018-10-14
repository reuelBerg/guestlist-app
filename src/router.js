
import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Dashboard from '@/components/Dashboard'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Home from '@/components/Home'
import listView from '@/components/listView'
import listEdit from '@/components/listEdit'
import accountSettings from '@/components/accountSettings'




Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/accountSettings/:id',
      name: 'accountsettings',
      component: accountSettings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {// not workiung
      path: '/edit/:id',
      name: 'edit',
      component: listEdit,
      meta: {
                requiresAuth: true
            }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '*',
      redirect: '/login',
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {next(); return}
  if (to.path === '/') {next(); return}

let currentUser = firebase.auth().currentUser;
let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
if (requiresAuth && !currentUser) {alert('je moet eerst inloggen voor deze pagina'); console.log('case 1'); next('login')}

//else if (!requiresAuth && currentUser) {console.log('case 2'); next('home')}

else {console.log('case 3'); next()}

})

export default router

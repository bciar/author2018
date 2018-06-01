import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'
import router from '@/router'
import firebase from 'firebase'
import Main from '@/components/Main'

Vue.use(Router)
Vue.use(Vuetify)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    }
  ]
})

router.beforeEach((to, from, next) => {
  
  // Check for requiresAuth guard
  let user = firebase.auth().currentUser
  console.log(user)
  if (to.matched.some(record => record.meta.requiresAuth)) {

    // Check if NO logged user
    if (!user) {
      console.log('no-currentUser')
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // Proceed to route
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (!user) {
      console.log('no currentUser')
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // Proceed to route
      next()
    }
  } else {
    // Proceed to route
    next()
  }
})

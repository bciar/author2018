// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import * as firebase from 'firebase'
import router from './router'

import {store} from './components/store/store.js';

import Vuetify from 'vuetify'
import VueResource from "vue-resource"
import 'vuetify/dist/vuetify.min.css'
//import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueResource);

Vue.use(Vuetify)
Vue.use(VueFire);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created (){
  	firebase.initializeApp({
      apiKey: "AIzaSyAvOjVb9-SwCFiWGDr1L9_PGz1Ei-1FVDc",
      authDomain: "author2018-53022.firebaseapp.com",
      databaseURL: "https://author2018-53022.firebaseio.com",
      projectId: "author2018-53022",
      storageBucket: "author2018-53022.appspot.com",
      messagingSenderId: "515142910133"
    });
    
  }
})

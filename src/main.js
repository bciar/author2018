// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import * as firebase from 'firebase'
import router from './router'

import {store} from './components/store/store.js';

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
//import 'material-design-icons-iconfont/dist/material-design-icons.css'

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
	  	apiKey: 'AIzaSyDkjPgg0gJZv3H317Oi7PG0IJ7BL79S3lE',
	    authDomain: 'fir-vue-a9e68.firebaseapp.com',
	    databaseURL: 'https://fir-vue-a9e68.firebaseio.com',
	    projectId: 'fir-vue-a9e68',
	    storageBucket: '',
	    messagingSenderId: '571313380191'
  	})
  }
})

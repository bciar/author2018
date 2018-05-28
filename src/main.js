// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import TextEditor from './components/TextEditor'
import Matrix from './components/Matrix'
import * as firebase from 'firebase'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import jQuery from 'jquery/dist/jquery.js'

import {store} from './components/store/store.js';


Vue.config.productionTip = false
Vue.use(VueFire);

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

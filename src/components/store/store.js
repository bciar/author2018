import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		counter: 0,
		logged_in: false,
		auth_id: -1,
		tab_list: ["species1","species2","species3"],
		item_list: []
	}
});
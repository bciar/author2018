import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		counter: 0,
		logged_in: null,
		auth_id: -1,

		tab_list: ["species1","species2","species3"],				// tab list

		item_list: [],												// item list for data table

		json_list: [{},{},{}],										// json data for each tabs

		text_array: ["Petals mostly 5, deciduous","b","c"],			// text data for each tabs

		item_index_list: {},										// list of item names for inex

		character_index_list: {},										// list of character names for inex
		
		ontology_index_list: {},										// list of ontology names for inex

		active_tab: 0,												// index of active tab

		table_highlights: []
	}
});
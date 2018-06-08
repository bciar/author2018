import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		counter: 0,
		logged_in: null,
		auth_id: -1,

		tab_list: [],		// tab list

		item_list: [],		// item list for Table, e.g. [ 0 => { name: "petal color", species1: "red", species2: "blue" }, 1 => { name: "petal count", species1: "2", species2: "4" }]

		itme_ontology_info_list: {},

		json_api_result: [],	// json result coming from parse service API

		text_array: [],			// text data for each tabs, e.g. [0 => "<b>petals</b> mostly 5, deciduous"]

		item_index_list: {},	// list of item name, e.g. { "petal color":"petal color", "petal count":"petal count"}

		ontology_index_list: {},	// list of ontology name, e.g. { "petal": "petal", "flower": "flower" }

		active_tab: 0,	// index of active tab

		table_highlights: [],		// list of highlights in table

		editor_highlights: []		// list of highlights in editor
	}
});

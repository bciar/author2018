import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		counter: 0,
		logged_in: null,
		auth_id: -1,

		tab_list: [],				// (Array) tab list	

		item_list: [],				// (Array) item list for Table, e.g. [ 0 => { name: "petal color", species1: "red", species2: "blue" }, 1 => { name: "petal count", species1: "2", species2: "4" }]

		item_ontology_info_list: {},// (Object) list of ontology information of items
		/*	// (Object)
			item_ontology_info_list[item_string][active_tab_name]
			{
				search_term: searchTerm,
				matching_parent_term: matchingParentTerm,
				matching_term_label: matchingTermLabel,
				matching_value: matchingValue,
			}
		*/

		json_api_result: [],		// (Array) json result coming from parse service API

		text_array: [],				// (Array) text data for each tabs, e.g. [0 => "<b>petals</b> mostly 5, deciduous"]

		item_index_list: {},		// (Object) list of item name, e.g. { "petal color":"petal color", "petal count":"petal count"}

		ontology_index_list: {},	// (Object) list of ontology name, e.g. { "petal": "petal", "flower": "flower" }

		active_tab: -1,				// (Number) index of active tab

		table_highlights: [],		// (Array) list of highlights in table

		editor_highlights: [],		// (Array) list of highlights in editor

		embeds_data: {}				// (Object) list of embed_mark in editor 
		/*
			embeds_data[active_tab_name][position_for_embed]
			{
           	  	search_term: search_term,
           	  	parent_term: parent_term,
           	  	text_index: index,
           	  	delta: delta,
           	  	item_key: key
			};
		*/
	}
});

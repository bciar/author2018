<template>
  <div style="height:100%">
    <v-layout row>
      <v-flex xs12>
        <taxon-tab ref="taxon_tab"></taxon-tab>
      </v-flex>
    </v-layout>
    <v-layout fluid fill-height >
      <v-flex xs5 fill-height >
        <v-layout row>
          <v-alert :value="true" outline  type="success" style="height:42px; width:100%">
            Edit a template to produce new description
          </v-alert>
            <v-btn v-on:click="matricize()" color="gray">Matricize</v-btn>
            <v-btn v-on:click="save_data()" color="white">Save</v-btn>
        </v-layout>
        <v-layout xs12 fill-height>
          <v-flex xs12>
            <div style="height:calc(100% - 200px)"  @contextmenu="showMenu">
              <rich-text v-model="$store.state.text_array[$store.state.active_tab]" :editorToolbar="customToolbar" style="height:100%" ref="rich_edit" id="editor_viewID"></rich-text>
              <v-menu
              v-model="showApproveMenu"
              :position-x="x"
              :position-y="y"
              offset-y
              absolute
              >
              <v-list>
                <v-list-tile v-for="(item, index) in items" :key="index">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
              <v-btn>Approve</v-btn>
              <v-btn>Disapprove</v-btn>
            </v-menu>
            </div>
            
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs7 fill-height>
        <table-view ref="table_view"></table-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Taxon from '@/components/Taxon'
import DataTable from '@/components/DataTable'
import { VueEditor } from 'vue2-editor'

import json from '@/json/newResponseJSON.json'
import firebase from 'firebase'



export default {
  name: 'Main',
  data () {
    return {
      customToolbar: [
        ['bold', 'italic',{'color':[]},{size: [ 'small', false, 'large', 'huge' ]}]
      ],
      editContent: "",
      showApproveMenu: false,
      x: 0,
      y: 0,
      items: [
      ],
      editor: null
    }
  },
  beforeCreate: function() {
  },
  mounted: function() {
    this.restore_data();

    this.editor = this.$refs.rich_edit.quill;
    //const cnt_editor = this.editor
    const self = this;
    this.editor.on('selection-change', function(range, oldRange, source) {
        var sel_node = window.getSelection();
        self.$refs.table_view.erase_highlight();
        if (sel_node.focusNode.parentNode.nodeName == "STRONG") {
          var highlight_str = sel_node.focusNode.nodeValue;
          self.$refs.table_view.highlight_word(highlight_str);
        }
    });
  },
  components: {
    "taxon-tab" : Taxon,
    "table-view" : DataTable,
    "rich-text" :VueEditor
    },
  methods: {
    // get all position data from text editor and add to hightlight array
    getIndicesOf(searchStr, str, caseSensitive) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index;
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            var item = {
              pos:index,
              len:searchStr.length
            }
            this.$store.state.editor_highlights.push(item);           // add to highlight array
            startIndex = index + searchStrLen;
        }
    },

    // highlight a word in text editor
    highlight_word (word) {
      this.erase_highlight();
      var textContent = this.editor.getText().toLowerCase();

      // add positions of word to highlight
      var indices = this.getIndicesOf(word, textContent);

      // add highlight format to words
      this.$store.state.editor_highlights.forEach(item => {
        this.editor.formatText(item.pos, item.len, {"background-color":"yellowgreen","color":"blue"}, true);
      });
    },

    // erase highlight format from words
    erase_highlight () {
      this.$store.state.editor_highlights.forEach(item => {
        this.editor.formatText(item.pos, item.len, {"background-color":"white","color":"black"}, true);
      });
      this.$store.state.editor_highlights = [];
    },

    parseOntologyId (id) {
      var ontologyID = id;
      var startIndex = ontologyID.indexOf('[');
      var endIndex = ontologyID.indexOf(']');
      var mainResult = ontologyID.substring(startIndex+1,endIndex);
      var firstColonIndex = mainResult.indexOf(':');
      var searchTerm = mainResult.substring(0,firstColonIndex);
      var slashIndex = mainResult.indexOf('/');
      var matchingParentTerm = mainResult.substring(firstColonIndex+1, slashIndex);
      var lastColonIndex = mainResult.lastIndexOf(':');
      var matchingTermLabel = mainResult.substring(slashIndex + 1, lastColonIndex);
      var matchingValue = mainResult.substring(lastColonIndex + 1, mainResult.length);

      var parseResult = {
        search_term: searchTerm,
        matching_parent_term: matchingParentTerm,
        matching_term_label: matchingTermLabel,
        matching_value: matchingValue,
      }
      return parseResult;
    },

    matricize () {
      var fetch_result;
      // there should fetch function; result will be retrieved to fetch result

      var parsecontent = this.editor.getText();
      this.$http.get('http://shark.sbs.arizona.edu:8080/parse?sentence='+encodeURI(parsecontent)).then(response => {
        //console.log(response);
        //fetch_result = response.body;
        fetch_result = json;
        this.$store.state.item_index_list = [];
        this.$store.state.item_list = [];
        const self = this;

        fetch_result.statements.forEach(val => {
          val.biologicalEntities.forEach(bioVal => {
            const bio = bioVal;

            this.$store.state.ontology_index_list[bioVal.name] = {
              name: bioVal.name,
              approved: false,
              nameOrigin: bioVal.name_original,
              ontology: null
            };

            // parse and store ontology matching info
            if(bioVal.hasOwnProperty('ontologyid')) {
              this.$store.state.ontology_index_list[bioVal.name].ontology = this.parseOntologyId(bioVal.ontologyid);
            }

            if(bioVal.hasOwnProperty('characters')) {
              bioVal.characters.forEach(character => {

                var item_string = bio.name + " " + character.name;

                // parse and store ontology matching info
                if(character.hasOwnProperty('ontologyid')) {
                  if ( !this.$store.state.itme_ontology_info_list.hasOwnProperty(character.name)) {
                    var item = {};
                    item[this.$store.state.tab_list[this.$store.state.active_tab]] = this.parseOntologyId(character.ontologyid);
                    this.$store.state.itme_ontology_info_list[character.name] = item;
                  } else {
                    this.$store.state.itme_ontology_info_list[character.name][this.$store.state.tab_list[this.$store.state.active_tab]] = this.parseOntologyId(character.ontologyid);
                  }
                } else {
                  // this.$store.state.itme_ontology_info_list[character.name] = null;
                  if ( !this.$store.state.itme_ontology_info_list.hasOwnProperty(character.name)) {
                    var item = {};
                    item[this.$store.state.tab_list[this.$store.state.active_tab]] = {
                      search_term: character.value
                    };
                    this.$store.state.itme_ontology_info_list[character.name] = item;
                  } else {
                    this.$store.state.itme_ontology_info_list[character.name][this.$store.state.tab_list[this.$store.state.active_tab]] = {
                      search_term: character.value
                    };
                  }
                }
                // check if item exist in table

                if(!this.$store.state.item_index_list.hasOwnProperty(item_string)) {
                  this.$store.state.item_index_list[item_string] = item_string;                   // save item for index key for future search
                  var item = {
                    name: item_string
                  }
                  item[this.$store.state.tab_list[this.$store.state.active_tab]] = character.value;
                  this.$store.state.item_list.push(item);                                         // add item record ; this will display item in table view
                } else {
                  this.$store.state.item_list.forEach(item => {
                    if(item.name == item_string) {
                      item[this.$store.state.tab_list[this.$store.state.active_tab]] = character.value;
                    }
                  });
                }
              });
            }
          });
        });
        //-----------------  item bold ----------------------
        const textContent = this.editor.getText().toLowerCase();
        // bold each items in editor
        for(var key in this.$store.state.ontology_index_list) {
          var index = textContent.search(key);
          if ( index != -1) {
            this.editor.formatText(index, key.length, "bold", true);
            
            if (this.$store.state.ontology_index_list[key].ontology != null) {
              if (this.$store.state.ontology_index_list[key].ontology.matching_value == 1) {
                this.editor.formatText(index, key.length, "color", "green");
              }
            }
          }
        }
        
        for(var key in this.$store.state.itme_ontology_info_list) {
          var characterOntologyInfo = this.$store.state.itme_ontology_info_list[key];
          if (characterOntologyInfo.hasOwnProperty(this.$store.state.tab_list[this.$store.state.active_tab])) {
            if (characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].hasOwnProperty('matching_value')) {
              var index = textContent.search(characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term);
              if ( index != -1) {
                console.log(characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term);
                if (characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].matching_value == 1) {
                  this.editor.formatText(index, characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term.length, "color", "green");
                }
              }
            } else {
              var search_term = characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term.toString();
              console.log(search_term + " " + search_term.length);

              var index = this.editor.getText().toLowerCase().search(search_term);
              if ( index != -1) {
                console.log(index);
                // this.editor.formatText(index, search_term.length, "color", "orange");
                this.editor.insertEmbed(index + search_term.length, 'image', '/static/quiz_mark.jpg');
                this.editor.update();
              }
            }
          }
        }
        this.$refs.table_view.$emit('update');
      });
    },

    save_data() {
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/description').remove();
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/table').remove();
      console.log(this.$store.state.tab_list);
      this.$store.state.tab_list.forEach((tab_item,key) => {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/description/' + this.$store.state.tab_list[key]).set({
          description: this.$store.state.text_array[key]
        });
      });

      this.$store.state.item_list.forEach((item, index) => {
        Object.keys(item).forEach(key => {
          var save_item = {};
          save_item[key] = item[key];
          firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/table/' + item['name'] + '/'+key).set({
            data: item[key]
          });
        })
      });

      var ontology_index_string = JSON.stringify(this.$store.state.ontology_index_list);
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/indices/' + 'ontology').set({
        data: ontology_index_string
      });

      //console.log(JSON.stringify(this.$store.state.ontology_index_list));
    },

    restore_data () {
      const self = this;
      var descriptionRef = firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/description');
      descriptionRef.on('value', function(snapshot) {
          if (snapshot.exists())
          {
              // restore data from db to text view
              self.$store.state.tab_list.length = 0;
              self.$store.state.text_array.length = 0;
              var description_json = snapshot.val();
              Object.keys(description_json).forEach(key => {
                self.$store.state.tab_list.push(key);
                self.$store.state.text_array.push(description_json[key].description);
              });
              self.$store.state.active_tab = 0;
          }
      });

        // restore data to table
        var tableRef = firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/table');
        tableRef.on('value', function(snapshot) {
            if (snapshot.exists())
            {
                self.$store.state.item_index_list = {};
                self.$store.state.item_list = [];
                // restore data from db to table
                var table_json = snapshot.val();
                //console.log(table_json);
                Object.keys(table_json).forEach(key => {
                  self.$store.state.item_index_list[key] = key;
                  const item = {
                  }
                  Object.keys(table_json[key]).forEach(item_key => {
                    item[item_key] = table_json[key][item_key].data;
                  });
                  self.$store.state.item_list.push(item);
                });
            }
        });
      var ontology_index = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/indices/' + 'ontology');
      ontology_index.on('value', function(snapshot) {
        //console.log(snapshot.val());
        if(snapshot.val() != null) {
        self.$store.state.ontology_index_list = JSON.parse(snapshot.val().data);
        }
      });
    },
    showMenu (e) {
      console.log(e);
      if (e.srcElement.style.color == "green") {
        if (e.srcElement.tagName == "STRONG") {     // search info in ontology list
          var term = e.srcElement.textContent.toLowerCase();
          for(var key in this.$store.state.ontology_index_list) {
            if (this.$store.state.ontology_index_list[key].ontology != null) {
              if (this.$store.state.ontology_index_list[key].ontology.search_term == term) {
                // this.editor.formatText(index, key.length, "color", "green");
                var matchingInfo = this.$store.state.ontology_index_list[key].ontology;
                this.items = [];
                this.items = [
                  {title: "Search Term:" + this.$store.state.ontology_index_list[key].ontology.search_term},
                  {title: "Matching Parent Term:" + this.$store.state.ontology_index_list[key].ontology.matching_parent_term},
                  {title: "Matching Term Label:" + this.$store.state.ontology_index_list[key].ontology.matching_term_label},
                  {title: "Matching Value:" + this.$store.state.ontology_index_list[key].ontology.matching_value}
                ];
              }
            }
          }
        }
        else {
                this.items = [];
        }
        this.showApproveMenu = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.showApproveMenu = true
        })
      }
      e.preventDefault();
    }
  }
}

</script>

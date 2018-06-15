<template>
  <div style="height:100%">
    <v-layout row>
      <v-flex xs12>
        <taxon-tab ref="taxon_tab"></taxon-tab>
      </v-flex>
    </v-layout>
    <v-layout fluid  style="height:calc(100% - 150px)">
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
            <div style="height:100%"  @contextmenu="showMenu">
              <rich-text v-model="$store.state.text_array[$store.state.active_tab]" :disabled="$store.state.active_tab == -1" :editorToolbar="customToolbar" style="height:100%" ref="rich_edit" id="editor_viewID" placeholder="Please select Tab and Edit description">
              </rich-text>
              <v-menu
                v-model="approveMenu.show"
                :position-x="approveMenu.posX"
                :position-y="approveMenu.posY"
                offset-y
                absolute
              >
                <v-list>
                  <v-list-tile v-for="(item, index) in approveMenu.menuItem" :key="index">
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile :key="-1">
                    <v-btn v-on:click.stop="approveItem()">Approve</v-btn>
                    <v-btn v-on:click.stop="disapproveItem()">Disapprove</v-btn>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-menu
                v-model="searchMenu.show"
                :position-x="searchMenu.posX"
                :position-y="searchMenu.posY"
                offset-y
                absolute
              >
                <v-list>
                  <v-list-tile :key="-3">
                    <v-list-tile-title>Search:{{ searchMenu.search_term }}</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile v-if="searchMenu.searching_icon" :key="-2" align-center>
                    <img src="/static/loading.gif" style="width:50px;height:50px">
                  </v-list-tile>
                  <v-list-tile v-for="(item, index) in searchMenu.menuItem" :key="index" v-on:click.stop="setSearchValue(item.title)">
                    <v-list-tile-content>{{ item.title }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile :key="-1">
                    <v-btn v-on:click.stop="newTermDlg()">New term</v-btn>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
            
            <v-snackbar
              :timeout="3000"
              :top="true"
              v-model="snackbar.show"
            >
              {{snackbar.msg}}
              <v-btn flat color="pink" @click.native="snackbar.show = false">Close</v-btn>
            </v-snackbar>

            <v-dialog v-model="submitDlg.show" max-width="500px">
              <v-card>
                <v-card-title>
                  Submit
                </v-card-title>
                <v-card-text>
                  <v-text-field v-model="submitDlg.term" placeholder="Input Term Name"></v-text-field>
                  <v-text-field v-model="submitDlg.parentTerm" placeholder="Input Parent Term Name"></v-text-field>
                  <v-text-field v-model="submitDlg.definition" placeholder="Input Definition"></v-text-field>
                  <v-text-field v-model="submitDlg.sentence" placeholder="Input Sentence"></v-text-field>
                  <v-text-field v-model="submitDlg.author" placeholder="Input Author Name"></v-text-field>
                  <v-text-field v-model="submitDlg.relatedTaxon" placeholder="Input Related Taxon"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.stop="submitTerm()">Submit</v-btn>
                  <v-btn color="primary" flat @click.stop="submitDlg.show = false">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>


          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs7 fill-height>
        <keep-alive>
          <table-view ref="table_view"></table-view>
        </keep-alive>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Taxon from '@/components/Taxon'
import DataTable from '@/components/DataTable'
import { VueEditor } from 'vue2-editor'

import json from '@/json/newResponseJson.json'
import searchJson from '@/json/searchDummy.json'
import firebase from 'firebase'
import Parchment from 'parchment'


export default {
  name: 'Main',
  data () {
    return {
      customToolbar: [
        ['bold', 'italic',{'color':[]},{size: [ 'small', false, 'large', 'huge' ]}]
      ],
      approveMenu: {
        posX: 0,
        posY: 0,
        show: false,
        menuItem: [],
        dom: null
      },
      searchMenu: {
        search_term: "",
        parent: "",
        score: "",
        searching_icon: true,
        quizInfo: null,
        posX: 0,
        posY: 0,
        show: false,
        menuItem: [],
        dom: null
      },
      submitDlg: {
        show: false,
        term: "",
        parentTerm: "",
        definition: "",
        sentence: "",
        author: "",
        relatedTaxon: "",
        quizInfo: null,
      },
      snackbar: {
        show: false,
        msg: ""
      },
      editor: null,
      embedData: {}
    }
  },
  beforeCreate: function() {
  },
  mounted: function() {
    const self = this;
    this.restore_data();
    this.editor = this.$refs.rich_edit.quill;
    this.editor.on('selection-change', function(range, oldRange, source) {
        var sel_node = window.getSelection();
        self.$refs.table_view.erase_highlight();
        if (sel_node.focusNode.parentNode.nodeName == "STRONG") {
          var highlight_str = sel_node.focusNode.nodeValue;
          self.$refs.table_view.highlight_word(highlight_str);
        }
    });
    if (this.$store.state.active_tab == -1) {
      //this.editor.enable(false);
    }
    self.$refs.table_view.refreshTable();

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
        //fetch_result = response.body;
        fetch_result = json;
        // this.$store.state.item_index_list = {};
        // this.$store.state.item_list = [];
        const self = this;

        fetch_result.statements.forEach(val => {
          val.biologicalEntities.forEach(bioVal => {
            const bio = bioVal;
            this.$store.state.ontology_index_list[bioVal.name] = {
              name: bioVal.name,
              approved: null,
              nameOrigin: bioVal.name_original,
              ontology: null
            };
            // parse and store ontology matching info
            if(bioVal.hasOwnProperty('ontologyid')) {
              this.$store.state.ontology_index_list[bioVal.name].ontology = this.parseOntologyId(bioVal.ontologyid);
            }
            if(bioVal.hasOwnProperty('character')) {
              bioVal.character.forEach(character => {
                var item_string = bio.name + " " + character.name;
                // parse and store ontology matching info
                if(character.hasOwnProperty('ontologyid')) {
                  if ( !this.$store.state.item_ontology_info_list.hasOwnProperty(item_string)) {
                    var item = {};
                    item[this.$store.state.tab_list[this.$store.state.active_tab]] = this.parseOntologyId(character.ontologyid);
                    this.$store.state.item_ontology_info_list[item_string] = item;
                  } else {
                    this.$store.state.item_ontology_info_list[item_string][this.$store.state.tab_list[this.$store.state.active_tab]] = this.parseOntologyId(character.ontologyid);
                  }
                } else {
                  // this.$store.state.item_ontology_info_list[item_string] = null;
                  if ( !this.$store.state.item_ontology_info_list.hasOwnProperty(item_string)) {
                    var item = {};
                    item[this.$store.state.tab_list[this.$store.state.active_tab]] = {
                      search_term: character.value
                    };
                    this.$store.state.item_ontology_info_list[item_string] = item;
                  } else {
                    this.$store.state.item_ontology_info_list[item_string][this.$store.state.tab_list[this.$store.state.active_tab]] = {
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
        this.$refs.table_view.refreshTable();
        this.setTextStyles();
        this.logActivity(3,this.$store.state.tab_list[this.$store.state.active_tab]);
      });
    },

    setTextStyles() {
      const textContent = this.editor.getText().toLowerCase();

      // delete all embeds before matricize
      var cells = document.getElementsByTagName("img");
      var embed_cnt = 0;
      for (var i = cells.length - 1; i >= 0 ; i --) {
        if( cells[i].outerHTML == '<img src="/static/quiz_mark.jpg">') {
          var embed_to_delete = Parchment.find(cells[i]);
          var imgIndex = this.editor.getIndex(embed_to_delete);
          this.editor.deleteText(imgIndex, 1);
          embed_cnt ++;
        }
      }
      this.$store.state.embeds_data = {};

      // bold each items in editor
      for(var key in this.$store.state.ontology_index_list) {
        var index = textContent.search(key);
        if ( index != -1) {
          this.editor.formatText(index, key.length, "bold", true);
          
          if (this.$store.state.ontology_index_list[key].ontology != null) {
            if (this.$store.state.ontology_index_list[key].ontology.matching_value == 1) {
              this.editor.formatText(index, key.length, "color", "lightgreen");
            }
          }
        }
      }
      
      for(var key in this.$store.state.item_ontology_info_list) {
        var characterOntologyInfo = this.$store.state.item_ontology_info_list[key];
        if (characterOntologyInfo.hasOwnProperty(this.$store.state.tab_list[this.$store.state.active_tab])) {
          if (characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].hasOwnProperty('matching_value')) {
            var index = textContent.search(characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term);
            if ( index != -1) {
              if (characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].approved == null) {
                if (characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].matching_value == 1) {
                  this.editor.formatText(index, characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term.length, "color", "lightgreen");
                }
              } else {
                if (characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].approved) {
                  this.editor.formatText(index, characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term.length, "color", "darkgreen");
                } else {
                  this.editor.formatText(index, characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term.length, "color", "orange");
                }
              }
            }
          } else {
            var search_term = characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term.toString();
            var parent_term = characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].matching_parent_term;
            //console.log(characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]]);
            var index = this.editor.getText().toLowerCase().search(search_term);
            if ( index != -1) {
              var embedOffset = 0;
              for (var embedKey in this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]]) {
                if( embedKey != 'undefined' && Number(embedKey) < index) {
                  embedOffset ++;
                }
              }
              var isExist = 0;
              for (var embedKey in this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]]) {
                if( embedKey != 'undefined' && this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][embedKey].text_index == index) {
                  isExist ++;
                }
              }
              if(isExist == 0) {
                var pos = embedOffset + index + search_term.length;
                var delta = this.editor.insertEmbed(pos, 'image', '/static/quiz_mark.jpg');
                if (!this.$store.state.embeds_data.hasOwnProperty(this.$store.state.tab_list[this.$store.state.active_tab])) {
                  this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]] = {};
                }
                this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][pos.toString()] = {
                  search_term: search_term,
                  parent_term: parent_term,
                  text_index: index,
                  delta: delta,
                  item_key: key
                };
              }
              this.editor.update();
            }
          }
        }
      }
      this.$refs.table_view.refreshTable();
    },

    save_data() {
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/tab_list').set({data:JSON.stringify(this.$store.state.tab_list)});
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/item_list').set({data:JSON.stringify(this.$store.state.item_list)});
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/item_ontology_info_list').set({data:JSON.stringify(this.$store.state.item_ontology_info_list)});
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/json_api_result').set({data:JSON.stringify(this.$store.state.json_api_result)});
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/text_array').set({data:JSON.stringify(this.$store.state.text_array)});
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/item_index_list').set({data:JSON.stringify(this.$store.state.item_index_list)});
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/ontology_index_list').set({data:JSON.stringify(this.$store.state.ontology_index_list)});
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/embeds_data').set({data:JSON.stringify(this.$store.state.embeds_data)});
      //alert('Successfully saved');
      this.snackbar.msg = "Saved successfully";
      this.snackbar.show = true;
      this.logActivity(9,'');
    },

    restore_data () {
      const self = this;
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/tab_list').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.tab_list = JSON.parse(snapshot.val().data);
        }
      });      
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/item_list').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.item_list = JSON.parse(snapshot.val().data);
        }
      });      
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/item_ontology_info_list').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.item_ontology_info_list = JSON.parse(snapshot.val().data);
        }
      });
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/json_api_result').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.json_api_result = JSON.parse(snapshot.val().data);
        }
      });
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/text_array').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.text_array = JSON.parse(snapshot.val().data);
        }
      });
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/item_index_list').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.item_index_list = JSON.parse(snapshot.val().data);
        }
      });
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/ontology_index_list').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.ontology_index_list = JSON.parse(snapshot.val().data);
        }
      });
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/embeds_data').on('value',function(snapshot) {
        if(snapshot.exists()) {
          self.$store.state.embeds_data = JSON.parse(snapshot.val().data);
    self.$refs.table_view.refreshTable();
        }
      });
    },
    showMenu (e) {
      //console.log(e);
      if (e.srcElement.tagName == "IMG") {
        //console.log(this.editor);
          var img = Parchment.find(e.target);
          console.log(img);
          var imgIndex = this.editor.getIndex(img);
          console.log(imgIndex);
          var quizData = this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][imgIndex];
          console.log(quizData);
          if (quizData != undefined) {
            this.searchMenu.quizInfo = quizData;
            this.searchMenu.search_term = quizData.search_term;
          } else {
            var prevNodeTxt = img.prev.text;
            var searchTerm = prevNodeTxt.substring(prevNodeTxt.lastIndexOf(' '), prevNodeTxt.length);
            console.log(img.prev);
                // this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][pos.toString()] = {
                  // search_term: search_term,
                  // parent_term: parent_term,
                  // text_index: index,
                  // delta: delta,
                  // item_key: key
                // };
            this.searchMenu.quizInfo = {
              search_term: searchTerm,
              parent_term: "",
              text_index: this.editor.getIndex(img.prev) + prevNodeTxt.lastIndexOf(' '),
              delta: img,
            };
            this.searchMenu.search_term = searchTerm;
          }
          this.searchMenu.embedIndex = imgIndex;
          //console.log(quizData);
          this.searchMenu.show = false
          this.searchMenu.posX = e.clientX
          this.searchMenu.posY = e.clientY
          this.$nextTick(() => {
            this.searchMenu.show = true            
            this.$http.get('http://shark.sbs.arizona.edu:8080/CAREX/search?term='+encodeURI(this.searchMenu.search_term)).then(response => {
              
              this.logActivity(6,'Term:'+this.searchMenu.search_term, 'Tab name:'+this.$store.state.tab_list[this.$store.state.active_tab]);
              //console.log(response);
              this.searchMenu.searching_icon = false;
              var result = searchJson.entries[0];
              this.searchMenu.parent = result.parentTerm;
              this.searchMenu.score = result.score;
              result.resultAnnotations.forEach(val => {
                this.searchMenu.menuItem.push({title:val.value});
              })
              
            });
          });
      } else {
        if (e.srcElement.style.color == "lightgreen") {
          var term = e.srcElement.textContent.toLowerCase();
          this.approveMenu.dom = e.srcElement;
          if (e.srcElement.tagName == "STRONG") {
            // search info in ontology list
            if(this.$store.state.ontology_index_list.hasOwnProperty(term)) {
              if (this.$store.state.ontology_index_list[term].ontology.search_term == term) {
                var matchingInfo = this.$store.state.ontology_index_list[term].ontology;
                this.approveMenu.menuItem = [];
                this.approveMenu.menuItem = [
                  {title: "Search Term:" + this.$store.state.ontology_index_list[term].ontology.search_term},
                  {title: "Matching Parent Term:" + this.$store.state.ontology_index_list[term].ontology.matching_parent_term},
                  {title: "Matching Term Label:" + this.$store.state.ontology_index_list[term].ontology.matching_term_label},
                  {title: "Matching Value:" + this.$store.state.ontology_index_list[term].ontology.matching_value}
                ];
              }
            }
          }
          else {
            // search info in character list this.$store.state.item_ontology_info_list[item_string][this.$store.state.tab_list[this.$store.state.active_tab]] 
            for(var key in this.$store.state.item_ontology_info_list) {
              var characterInfo = this.$store.state.item_ontology_info_list[key];
              if(characterInfo.hasOwnProperty(this.$store.state.tab_list[this.$store.state.active_tab])) {
                if(characterInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term == term) {
                  var matchingInfo = characterInfo[this.$store.state.tab_list[this.$store.state.active_tab]];            
                  this.approveMenu.menuItem = [];
                  this.approveMenu.menuItem = [
                    {title: "Search Term:" + matchingInfo.search_term},
                    {title: "Matching Parent Term:" + matchingInfo.matching_parent_term},
                    {title: "Matching Term Label:" + matchingInfo.matching_term_label},
                    {title: "Matching Value:" + matchingInfo.matching_value}
                  ];
                }
              }
            }
          }
          this.approveMenu.show = false
          this.approveMenu.posX = e.clientX
          this.approveMenu.posY = e.clientY
          this.$nextTick(() => {
            this.approveMenu.show = true
          });
        }
      }
      e.preventDefault();
    },
    approveItem() {
      this.approveMenu.dom.style.color = "darkgreen";
      this.logActivity(4,'Term:'+this.approveMenu.dom.textContent, 'Tab name:'+this.$store.state.tab_list[this.$store.state.active_tab]);
      this.approveMenu.dom = null;
      this.approveMenu.show = false;
    },
    disapproveItem() {
      this.approveMenu.dom.style.color = "orange";
      this.logActivity(5,'Term:'+this.approveMenu.dom.textContent, 'Tab name:'+this.$store.state.tab_list[this.$store.state.active_tab]);
      this.approveMenu.dom = null;
      this.approveMenu.show = false;
    },
    newTermDlg () {
      console.log("new Term");
      this.searchMenu.show = false;
      this.submitDlg.term = this.searchMenu.search_term;
      this.submitDlg.author = firebase.auth().currentUser.email;
      this.submitDlg.show = true;
    },
    submitTerm() {
      if (this.submitDlg.term == "" || this.submitDlg.author == "" || this.submitDlg.definition == "" || this.submitDlg.sentence == "") {
        this.snackbar.msg = "Input valid values!";
        this.snackbar.show = true;
        return;
      }
      const termData = {
        term: this.submitDlg.term,
        parentTerm: this.submitDlg.parentterm,
        definition: this.submitDlg.definition,
        setence: this.submitDlg.sentence,
        author: this.submitDlg.author,
        relatedTaxon: this.submitDlg.relatedTaxon,
        submissionTime: Date.now()
      }
      this.$http.post('http://shark.sbs.arizona.edu:8080/submit',termData).then((response) => {
        console.log(response);
        this.snackbar.msg = "Submitted successfully";
        this.snackbar.show = true;
        this.logActivity(7,'Term:'+termData.term, 'Tab name:'+this.$store.state.tab_list[this.$store.state.active_tab] + ',ParentTerm:' + termData.parentTerm);
      });
    },
    setSearchValue (val) {
      // exchange text value
      this.editor.deleteText(this.searchMenu.quizInfo.text_index, this.searchMenu.search_term.length + 1);      // +1 : delete embed icon
      var deltaPos = val.length - this.searchMenu.search_term.length - 1;
      this.editor.insertText(this.searchMenu.quizInfo.text_index, val, {'color':'lightgreen'});

      // delete embed info
      delete this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][this.searchMenu.embedIndex];

      // if origin value and new value has different length , increase index of index of embeds after indicated embeds
      if (this.$store.state.embeds_data.hasOwnProperty(this.$store.state.tab_list[this.$store.state.active_tab])) {
        var embeds = this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]];
        for(var key in this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]]) {
          if ( Number(key) > this.searchMenu.embedIndex) {
            var tmp = this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][key];
            delete this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][key];
            var new_key = String(Number(key) + deltaPos);
            this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][new_key] = tmp;
            this.$store.state.embeds_data[this.$store.state.tab_list[this.$store.state.active_tab]][new_key].text_index += deltaPos + 1;
          }
        }
      }

      for(var key in this.$store.state.item_ontology_info_list) {
        var characterOntologyInfo = this.$store.state.item_ontology_info_list[key];
        if (characterOntologyInfo.hasOwnProperty(this.$store.state.tab_list[this.$store.state.active_tab])) {
          if (characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term == this.searchMenu.search_term) {
            characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].search_term = val;
            characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].matching_parent_term = this.searchMenu.parent;
            characterOntologyInfo[this.$store.state.tab_list[this.$store.state.active_tab]].matching_value = val;
          }
        }
      }

      if (this.$store.state.item_ontology_info_list.hasOwnProperty(this.searchMenu.quizInfo.item_key)) {
        //delete this.$store.state.item_ontology_info_list[this.searchMenu.search_term][this.$store.state.tab_list[this.$store.state.active_tab]];
        if (this.$store.state.item_ontology_info_list[this.searchMenu.quizInfo.item_key].hasOwnProperty(this.$store.state.tab_list[this.$store.state.active_tab])) {
          var ontologyInfo = {
            search_term: val,
            matching_parent_term: this.searchMenu.parent,
            matching_parent_label: '',
            matching_value: this.searchMenu.score
          };
          this.$store.state.item_ontology_info_list[this.searchMenu.quizInfo.item_key][this.$store.state.tab_list[this.$store.state.active_tab]] = ontologyInfo;
          this.$store.state.item_list.forEach(item => {
            if(item.name == this.searchMenu.quizInfo.item_key) {
              item[this.$store.state.tab_list[this.$store.state.active_tab]] = val;
            }
          });
        }
      }
      this.searchMenu.show = false;
      this.$refs.table_view.refreshTable();
      this.logActivity(10,'Term:'+val, 'Tab name:'+this.$store.state.tab_list[this.$store.state.active_tab]);
    },

    logActivity(act_id, detail, detail_addition = "") {
      var url = 'http://shark.sbs.arizona.edu/';
      this.$http.get(url+'api/v1/activity_log?user_email'+firebase.auth().currentUser.email+'&type='+act_id+'&detail='+encodeURI(detail)+'&detail_addition='+encodeURI(detail_addition)).then((response)=>{
        console.log(response);
      });
    }
  }
}

</script>

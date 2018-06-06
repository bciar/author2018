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
            <div style="height:calc(100% - 200px)">
              <rich-text v-model="$store.state.text_array[$store.state.active_tab]" :editorToolbar="customToolbar" style="height:100%" ref="rich_edit" id="editor_viewID"></rich-text>
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

import json from '@/json/responseJSON.json'
import firebase from 'firebase'



export default {
  name: 'Main',
  data () {
    return {
      customToolbar: [
        ['bold', 'italic',{'color':[]},{size: [ 'small', false, 'large', 'huge' ]}]
      ],
      editContent: "",
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

    matricize () {
      var fetch_result;

      // there should fetch function; result will be retrieved to fetch result
      //var parsecontent = JSON.stringify(this.editor.getContents());
      var parsecontent = this.editor.getText();
      //console.log(encodeURI(parsecontent));
      // console.log(this.$http);
      this.$http.get('http://shark.sbs.arizona.edu:8080/parse?sentence='+encodeURI(parsecontent)).then(response => {
          console.log(response);
          fetch_result = response.body;
          this.$store.state.item_index_list = [];
          this.$store.state.item_list = [];
          const self = this;

          fetch_result.statements.forEach(val => {
            val.biologicalEntities.forEach(bioVal => {
              const bio = bioVal;

              if(!this.$store.state.ontology_index_list.hasOwnProperty(bioVal.name)){
                this.$store.state.ontology_index_list[bioVal.name] = bioVal.name;
              }

              bioVal.characters.forEach(character => {

                var item_string = bio.name + " " + character.name;

                // check if item exist in table

                if(!this.$store.state.item_index_list.hasOwnProperty(item_string)) {
                  this.$store.state.item_index_list[item_string] = item_string;             // save item for index key for future search
                  var item = {
                    name: item_string
                  }
                  item[this.$store.state.tab_list[this.$store.state.active_tab]] = character.value;
                  this.$store.state.item_list.push(item);                               // add item record ; this will display item in table view
                } else {
                  this.$store.state.item_list.forEach(item => {
                    if(item.name == item_string) {
                      item[this.$store.state.tab_list[this.$store.state.active_tab]] = character.value;
                    }
                  });
                }
              });
            });
          });


          //-----------------  item bold ----------------------

          const textContent = this.editor.getText().toLowerCase();
          // bold each items in editor
          for(var key in this.$store.state.ontology_index_list) {
            var index = textContent.search(key);
            this.editor.formatText(index, key.length, "bold", true);
          }
          //console.log(this.$refs.table_view);
          this.$refs.table_view.$emit('update');
          ////////////////////////////////////////////////////////////////////////
      });
      //fetch_result = json;    // save simulated data
    },

    save_data() {
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/description').remove();
      firebase.database().ref("users/" + firebase.auth().currentUser.uid + '/table').remove();
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

      console.log(JSON.stringify(this.$store.state.ontology_index_list));
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
      }
  }
}

</script>

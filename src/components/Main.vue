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
            <v-btn color="white">Save</v-btn>
        </v-layout>
        <v-layout xs12 fill-height>
          <v-flex xs12>
            <div v-on:click.stop="select_word()" v-on:dblclick="select_word()" style="height:calc(100% - 200px)">
              <rich-text v-model="$store.state.text_array[$store.state.active_tab]" :editorToolbar="customToolbar" style="height:100%" ref="rich_edit"></rich-text>
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

export default {
  name: 'Main',
  data () {
    return {
      customToolbar: [
        //['bold', 'italic', 'underline',{'color':[]}]
      ],
      editContent: "",
      editor: null
    }
  },
  mounted: function() {
    
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
    /*
      if (range) {
        console.log(source);
        if (range.length == 0) {
          console.log('User cursor is on', range.index);
        } else {
          var text = cnt_editor.getText(range.index, range.length);
          console.log('User has highlighted', text);
        }
      } else {
        console.log('Cursor not in the editor');
      }*/
    });
  },
  components: { 
    "taxon-tab" : Taxon,
    "table-view" : DataTable,
    "rich-text" :VueEditor
    },
  methods: {
    select_word () {
      //console.log(this.editor.getSelection());
      /*
      var dt = window.getSelection();
      var selected_txt = dt.toString();
      //dt.$emit("bold");
      //var parentND = dt.p
      //dt.nodeValue = "1111111111";
      //dt.anchorNode.textContent = "11111111";
      //dt.anchorNode.cloneNode();
      if(selected_txt != "")
      {
        var editor = this.$refs.rich_edit;
        console.log(editor.quill);
        //editor.insertEmbed(0, 'image', "/src/assets/logo.png");
        var range = editor.quill.getSelection();
        if(range){

            editor.quill.formatText(range,'bold',true);
        }
        editor.quill.insertEmbed(range.index, 'image', "http://localhost:8081/assets/logo.png");
      }
      */
    },
    matricize () {

      var fetch_result;

      // there should fetch function; result will be retrieved to fetch result
      
      fetch_result = json;    // save simulated data

      /////////////////////////////////////////////////////////////////////////

      const records = this.$store.state.item_list;
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
                  console.log(item.name);
                  item[this.$store.state.tab_list[this.$store.state.active_tab]] = character.value;
                  console.log(item);
                  //this.$refs.table_view.$emit('updated', this.$refs.table_view);
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

      ////////////////////////////////////////////////////////////////////////

    }
  }
}

</script>

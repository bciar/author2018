<template>
  <div style="height:100%">
    <v-layout row>
      <v-flex xs12>
        <taxon-tab ref="tab"></taxon-tab>
      </v-flex>
    </v-layout>
    <v-layout fluid fill-height >
      <v-flex xs5 fill-height >
        <v-layout row>
          <v-alert :value="true" outline  type="success" style="height:42px; width:100%">
            Edit a template to produce new description
          </v-alert>
            <v-btn color="gray">Matricize</v-btn>
            <v-btn color="white">Save</v-btn>
        </v-layout>
        <v-layout xs12 fill-height>
          <v-flex xs12>
            <div v-on:click.stop="select_word()" v-on:dblclick="select_word()">
            <rich-text v-model="editContent" :editorToolbar="customToolbar" style="height:calc(100% - 112px)"></rich-text>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs7 fill-height>
        <table-view></table-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Taxon from '@/components/Taxon'
import DataTable from '@/components/DataTable'
import { VueEditor } from 'vue2-editor'

export default {
  name: 'Main',
  data () {
    return {
      customToolbar: [
            ['bold', 'italic', 'underline',{'color':[]}]
          ]
    }
  },
  computed: {
    editContent: function () {
      //console.log(this.$refs);
      //return this.$store.text_datas[this.$refs.tab.active];
    }
  },
  components: { 
    "taxon-tab" : Taxon,
    "table-view" : DataTable,
    "rich-text" :VueEditor
    },
  methods: {
    select_word () {
      console.log(window.getSelection().toString());
      var dt = window.getSelection();
      console.log(dt);
      //dt.$emit("bold");
      //var parentND = dt.p
      //dt.nodeValue = "1111111111";
      dt.anchorNode.textContent = "11111111";
      //dt.anchorNode.cloneNode();

    }
  }
}

</script>

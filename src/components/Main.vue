<template>
  <div style="height:100%">
    <v-layout row>
      <v-flex xs12>
        <taxon-tab></taxon-tab>
      </v-flex>
    </v-layout>
    <v-layout fluid fill-height >
      <v-flex xs5 fill-height >
        <v-layout row>
          <v-alert :value="true" outline  type="success" style="height:42px; width:100%">
            Edit a template to produce new description
          </v-alert>
            <v-btn color="gray">Matricize</v-btn>
        </v-layout>
        <v-layout xs12 fill-height>
          <v-flex xs12>
            <rich-text v-model="msg" :editorToolbar="customToolbar" style="height:calc(100% - 112px)"></rich-text>
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
      msg: 'Welcome to Your Vue.js App',
      customToolbar: [
            ['bold', 'italic', 'underline']
          ]
    }
  },
  components: { 
    "taxon-tab" : Taxon,
    "table-view" : DataTable,
    "rich-text" :VueEditor
    },
  methods: {

  }
}

</script>

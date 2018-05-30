<template>
  <div style="height:100%">
    <v-layout row>
      <v-flex xs12>
        <taxon-tab></taxon-tab>
      </v-flex>
    </v-layout>
    <v-layout fluid fill-height >
      <v-flex xs5 fill-height >
        <rich-text v-model="msg" :editorToolbar="customToolbar" style="height:calc(100% - 112px)"></rich-text>
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

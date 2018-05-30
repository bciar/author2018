<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td v-for="(key, value) in headers" :key="key" class="text-xs-right">{{ value }}</td>
    </template>
    <template slot="no-data">
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display here :(
      </v-alert>
    </template>
  </v-data-table>
</template>

<script>

export default {
    name: 'DataTable',
    data () {
        return {
          text: "Hello World!",
          desserts: []
        }
    },
    computed: {
        headers: function() {
            var header = [{text:"Organism",value:"name"}];
            this.$store.state.tab_list.forEach(val => {
                var data = {
                    text: val,
                    value: val,
                    sortable: false,
                };
                header.push(data);
            });
            return header;
        }
    },
    components: {
      
    },
    methods: {
    }
}

</script>

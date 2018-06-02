<template>
  <v-data-table
    :headers="headers"
    :items="$store.state.item_list"
    hide-actions
    class="elevation-1"
     ref="table_node"
  >
    <template slot="items" slot-scope="props">
      <td v-for="(key) in headers" :key="key.value" class="text-xs-left">{{ props.item[key.value] }}</td>
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
            var header = [{text:"Name",value:"name"}];
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
      highlight_word(searchText) {
        if (!searchText) {
            // Throw error here if you want...
            return;
        }
        var cells = document.getElementsByTagName("td");

        for (var i = 0; i < cells.length; i++) {
          if (cells[i].textContent.toLowerCase().includes(searchText.toLowerCase())) {
            this.$store.state.table_highlights.push(cells[i]);
            this.highlight_cell(cells[i],searchText);
          }
        }
      },

      erase_highlight() {
        this.$store.state.table_highlights.forEach(cell => {
          cell.innerHTML = cell.innerText;
        })
        this.$store.state.table_highlights.length = 0;
      },

      highlight_cell(cell, str) {
        var innerText = cell.innerText;
        var pos = innerText.toLowerCase().search(str.toLowerCase());
        var start_part = innerText.substring(0,pos);
        var highlight_word = "<span class='highlight'>"+" " + innerText.substring(pos, pos + str.length) + "</span>";
        var end_part = innerText.substring(pos + str.length,innerText.length);
        cell.innerHTML = start_part + highlight_word + end_part;
      }

    }
}

</script>

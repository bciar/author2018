<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    hide-actions
    class="elevation-1"
     ref="table_node"
     id="table_viewID"
  >
    <template slot="items" slot-scope="props">
      <td contenteditable="false" v-for="(key) in headers" :key="key.value" class="text-xs-left" v-on:dblclick="toggle_edit" v-on:click="highlight_text" v-on:keyup="keyup_event(props.item[key.value])" v-on:keydown.enter="keydown_event">
        <v-tooltip bottom>
          <span slot="activator">{{ props.item[key.value] }}</span>
        <span>{{ props.item[key.value] }}</span>
        </v-tooltip>
      </td>

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
          text: "Hello World!"
        }
    },
    computed: {
        headers: function() {
            var header = [{text:"Name",value:"name",sortable:false}];
            this.$store.state.tab_list.forEach(val => {
                var data = {
                    text: val,
                    value: val,
                    sortable: false,
                };
                header.push(data);
            });
            return header;
        },
        desserts: function() {
          return this.$store.state.item_list;
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
          //console.log(cell); 
          cell.firstChild.firstChild.innerHTML = cell.innerText;
        })
        this.$store.state.table_highlights.length = 0;
        this.$parent.erase_highlight();
      },

      highlight_cell(cell, str) {
        var innerText = cell.innerText;
        var pos = innerText.toLowerCase().search(str.toLowerCase());
        var start_part = innerText.substring(0,pos);
        var highlight_word = "<span class='highlight'>"+" " + innerText.substring(pos, pos + str.length) + "</span>";
        var end_part = innerText.substring(pos + str.length,innerText.length);
        console.log(cell);
        cell.firstChild.firstChild.innerHTML = start_part + highlight_word + end_part;
      },

      highlight_text (event) {
        event.preventDefault();
        
        console.log('highlight');
        if(window.getSelection().toString() == "")
        {
          return;
        }
        var str = this.GetWordByPos(window.getSelection().anchorNode.textContent, window.getSelection().focusOffset);
        this.erase_highlight();
        this.highlight_word(str);
        this.$parent.highlight_word(str);
      },

      GetWordByPos(str, pos) {
        var left = str.substring(0, pos);
        var right = str.substring(pos);

        left = left.replace(/^.+ /g, "");
        right = right.replace(/ .+$/g, "");

        return left + right;
      },

      keyup_event (origin_text) {
        var new_text = window.getSelection().focusNode.parentNode.textContent;
        if (new_text != origin_text) {
          console.log(window.getSelection());
          window.getSelection().focusNode.parentNode.className += " changed-cell";
        }

      },

      keydown_event (event) {
        event.preventDefault();
        event.srcElement.contentEditable = false;
      },
      toggle_edit (event) {
        console.log(event);
        event.srcElement.contentEditable = true;
      }
    }
}

</script>

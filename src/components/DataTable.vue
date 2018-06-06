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
      <td contenteditable="true" v-for="(key) in headers" :key="key.value" class="text-xs-left" v-on:dblclick="highlight_text" v-on:click="highlight_text" v-on:keydown="keydown_event">{{ props.item[key.value] }}</td>
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
          cell.innerHTML = cell.innerText;
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
        cell.innerHTML = start_part + highlight_word + end_part;
      },

      highlight_text () {
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

      keyup_event (event) {
        
        console.log(event);
      },

      keydown_event (event) {
        event.preventDefault();
        console.log(event.key);
        console.log(window.getSelection());
        if (window.getSelection().focusNode.parentElement.className == "new-text") {
          //window.getSelection().focusNode.textContent += event.key;
          return ; 
        } else {
          var caret_offset = window.getSelection().focusOffset;
          //window.getSelection().focusNode.textContent += event.key;
          window.getSelection().anchorNode.data = window.getSelection().anchorNode.data.substring(0,window.getSelection().anchorOffset) + "<span class='new-text'>" + event.key + "</span>" + window.getSelection().anchorNode.data.substring(window.getSelection().anchorOffset,window.getSelection().anchorNode.data.length);
        }
      }
    }
}

</script>

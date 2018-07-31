<template>
    <div>
      <v-tabs v-model="active" color="gray" dark>
        <v-tab color="white" v-bind:style="styleObject" v-for="(tab, key) in tabNames" :key="key" ripple v-on:dblclick="editTab(key)" v-on:click="changeTab(key)">
          {{tab}}
        </v-tab>
        <v-spacer></v-spacer>
        <v-btn flat fab dark small color="white darken-1" v-on:click="editTab(-1)">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn :disabled="$parent.isLoading" flat fab dark small color="white darken-1" v-on:click="deleteTab()">
          <v-icon dark>close</v-icon>
        </v-btn>
      </v-tabs>

      <v-dialog v-model="editDlg" max-width="500px">
        <v-card>
          <v-card-title>
            {{this.modalName}}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="new_name" placeholder="Input Taxon Name"></v-text-field>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.stop="saveName()">Save</v-btn>
            <v-btn color="primary" flat @click.stop="editDlg = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>

export default {
    name: 'Taxon',
    data () {
        return {
            active: null,
            editDlg: false,
            newDlg: false,
            tabNames: [],
            modalName: '',
            new_name: '',
            current_index: '',
            styleObject: {
                //color: 'red',
                'borderWidth': '1px',
                'borderColor': 'gray',
                'borderStyle': 'solid',
                'color': 'white'
                //border: 'solid 1px color',
            },
        }
    },
    mounted () {
        this.updateTabNames()
    },
    methods: {
        updateTabNames () {
            this.tabNames = this.$store.state.tab_list;
            if (this.$store.state.active_tab != -1) 
                this.active = this.$store.state.active_tab;
        },
        editTab (key) {
            if(key != -1) {
                //this.new_name = this.$store.state.tab_list[key];
                this.current_index = key;
                this.modalName = "Change Tab Name";
                this.editDlg = true;
            } else {
                this.new_name = '';
                this.current_index = key;
                this.modalName = "New Tab Name";
                this.editDlg = true;
            }
            this.updateTabNames();
        },

        checkIfExist(val) {
            for (var i = 0; i < this.$store.state.tab_list.length; i++) {
                if(this.$store.state.tab_list[i].toLowerCase() == val.toLowerCase()) {
                    return 1;
                }
            }
            return 0;
        },

        saveName () {
            if (this.checkIfExist(this.new_name) == 1) {
                this.$parent.snackbar.msg = "Name already exist";
                this.$parent.snackbar.show = true;
                return 0;
            }
            if (this.current_index == -1) {
                if (this.$store.state.tab_list.length == 1 && this.$store.state.tab_list[0] == "ENTER Taxon name to start") {
                    this.$store.state.tab_list[0] = this.new_name;
                }
                else {
                    this.$store.state.tab_list.push(this.new_name);
                    this.$store.state.text_array.push("");
                    this.$store.state.description_array.push("");

                }

                this.$parent.logActivity(1,'New Name:'+this.new_name);

            } else {
                var oldName = this.$store.state.tab_list[this.current_index];
                this.$store.state.item_list.forEach((item, index) => {
                    if (item.hasOwnProperty(oldName)) {
                        item[this.new_name] = item[oldName];//this.$store.state.tab_list[this.current_index];
                        delete item[oldName];
                    }
                });
                this.$store.state.tab_list[this.current_index] = this.new_name;

                if (this.$store.state.embeds_data.hasOwnProperty(oldName)) {
                    var oldTabEmbeds = this.$store.state.embeds_data[oldName];
                    delete this.$store.state.embeds_data[oldName];
                    this.$store.state.embeds_data[this.new_name] = oldTabEmbeds;
                }
                this.$parent.logActivity(2,'New Name:'+this.new_name, 'Old Name:'+ oldName);
                
                if (oldName == "ENTER Taxon name to start") {
                    this.$store.state.active_tab = 0;
                }
                this.changeTab(this.current_index);
            }
            this.editDlg = false;
            this.$parent.$refs.table_view.refreshTable();
            this.updateTabNames();
        },

        changeTab (index) {
            this.$parent.$refs.table_view.erase_highlight();
            this.$parent.erase_highlight();
            if (this.$store.state.tab_list[index] == "ENTER Taxon name to start" || this.$store.state.tab_list[index] == "Double Click to change Name") {
                this.$store.state.active_tab = -1;
                return;
            }
            const self = this;
            this.$store.state.active_tab = index;
            // this.$nextTick(() => {
            //     var word = self.$parent.$refs.table_view.highlightedWord;
            //     self.$parent.highlight_word(word);
            // })
            // var word = this.$parent.$refs.table_view.highlightedWord;
            // console.log(word)
            // console.log(this.$parent)
            // this.$parent.highlight_word(word);
            if (this.$store.state.text_array[this.$store.state.active_tab] == undefined) {
                this.$store.state.text_array[this.$store.state.active_tab] = "";
            }
            this.updateTabNames();
        },

        deleteTab () {
            const oldName = this.$store.state.tab_list[this.$store.state.active_tab];
            this.$store.state.item_list.forEach((item, index) => {
                if (item.hasOwnProperty(oldName)) {
                    item[this.new_name] = item[oldName];//this.$store.state.tab_list[this.current_index];
                    delete item[oldName];
                }
            });

            if (this.$store.state.embeds_data.hasOwnProperty(oldName)) {
                var oldTabEmbeds = this.$store.state.embeds_data[oldName];
                delete this.$store.state.embeds_data[oldName];
                this.$store.state.embeds_data[this.new_name] = oldTabEmbeds;
            }
            var deleteIndex = 0;
            this.$store.state.active_tab = 0;
            this.$store.state.tab_list.forEach( (item, index) => {
                if (item == oldName) {
                    //delete item;
                    this.$store.state.tab_list.splice(index,1);
                    this.$store.state.text_array.splice(index, 1);
                    this.$store.state.description_array.splice(index, 1);
                    this.changeTab(0);
                }
            });


            if (this.$store.state.tab_list.length == 0) {                
                this.$store.state.tab_list.push("ENTER Taxon name to start");
                this.$store.state.text_array[0] = "";
                this.$store.state.item_list = [];
                this.$store.state.description_array[0] = "";
                this.$store.state.active_tab = -1;
                this.updateTabNames();
            } else {
                //this.$parent.matricize(true);
                this.$parent.matricize(true);
            }
            // this.$parent.logActivity(2,'New Name:'+this.new_name, 'Old Name:'+ oldName);
            this.$parent.$refs.table_view.refreshTable();
        }

    }
}

</script>

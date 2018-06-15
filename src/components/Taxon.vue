<template>
    <div>
      <v-tabs v-model="active" color="blue" dark slider-color="yellow">
        <v-tab color="black" v-for="(tab, key) in $store.state.tab_list" :key="key" ripple v-on:dblclick="editTab(key)" v-on:click="changeTab(key)">
          {{tab}}
        </v-tab>
        <v-spacer></v-spacer>
        <v-btn color="indigo" v-on:click="editTab(-1)">New Tab</v-btn>
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
            modalName: '',
            new_name: '',
            current_index: ''
        }
    },
    mounted () {
    },
    methods: {

        editTab (key) {
            if(key != -1) {
                this.new_name = this.$store.state.tab_list[key];
                this.current_index = key;
                this.modalName = "Change Tab Name";
                this.editDlg = true;
            } else {
                this.new_name = '';
                this.current_index = key;
                this.modalName = "New Tab Name";
                this.editDlg = true;
            }
        },

        saveName () {
            if (this.current_index == -1) {
                this.$store.state.tab_list.push(this.new_name);
                this.$store.state.text_array.push("");
                
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
            }
            this.editDlg = false;
            this.$parent.$refs.table_view.refreshTable();
        },

        changeTab (index) {
            this.$store.state.active_tab = index;
        }
    }
}

</script>

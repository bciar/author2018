<template>
    <!-- if the user is not logged in then display this -->
    <v-app id="inspire">
      <v-toolbar v-if="$store.state.logged_in" color="grey darken-2" dark  app clipped-right>
        <v-toolbar-title>Description Editor</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="grey" v-on:click="onSignOut">SignOut</v-btn>
        <v-btn color="grey" v-on:click.stop="Export2Doc('editor_viewID','doc_description')">Export as *.doc</v-btn>
        <v-btn v-on:click.stop="ExportTableToExcel('table_viewID','excel_table')" color="grey">Export as *.xlsx</v-btn>
      </v-toolbar>
      <v-content v-if="$store.state.logged_in == false">
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="grey darken-2">
                  <v-toolbar-title>Login</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="email" prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
                    <v-text-field v-model="password" id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="grey" v-on:click="onLogin">SignIn</v-btn>
                  <v-btn color="grey" v-on:click="onSignUp">SignUp</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-content v-else-if="$store.state.logged_in == true">
        <Main ref="mainComp"></Main>
      </v-content>
    </v-app>
</template>

<script>
import Main from '@/components/Main'
import firebase from 'firebase'
import Parchment from 'parchment'

export default {
  name: 'App',
  data(){
    return{
      name: 'Paul',
      logged_in: false,
      email: '',
      password: '',
      auth_id: ''
    }
  },
  props: {
    source: String
  },
  components: {Main},
  methods: {
    onSignOut() {
      this.$store.state.logged_in = false;
      this.$root.user = null
      firebase.auth().signOut().then(function () {
        //router.push({path: '/'})
      })
    },
    onLogin() {
      const auth = firebase.auth();
      const promise = firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then((user)=>{
        var url = 'http://shark.sbs.arizona.edu/';
        this.$http.get(url+'api/v1/activity_log?user_email='+user.email+'&type=8&detail='+user.email).then((response)=>{
          console.log(response);
        });
      })
      .catch(
        error => {
          alert(error.message);
          return;
        });

    },
    onSignUp(){
      const auth = firebase.auth();
      const promise = firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(
        error => {
          alert(error.message);
          return;
        });
     },
    ExportTableToExcel(tableID, filename = ''){
      var downloadLink;
      var dataType = 'application/vnd.ms-excel';
      var tableSelect = document.getElementById(tableID);
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

      // Specify file name
      filename = filename?filename+'.xls':'excel_data.xls';

      // Create download link element
      downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['\ufeff', tableHTML], {
              type: dataType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

          // Setting the file name
          downloadLink.download = filename;

          //triggering the function
          downloadLink.click();
      }
    },


    Export2Doc (element, filename = '') {
      // delete all embeds before export doc
      var cells = document.getElementsByTagName("img");
      var embed_cnt = 0;
      var embedsArray = [];
      for (var i = cells.length - 1; i >= 0 ; i --) {
        if( cells[i].outerHTML == '<img src="/static/quiz_mark.jpg">') {
          var embed_to_delete = Parchment.find(cells[i]);
          var imgIndex = this.$refs.mainComp.editor.getIndex(embed_to_delete);
          embedsArray.push(imgIndex);
          this.$refs.mainComp.editor.deleteText(imgIndex, 1);
          embed_cnt ++;
        }
      }


      var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      var postHtml = "</body></html>";

      var editortag = document.getElementsByClassName('ql-editor');
      var content = editortag[0].innerHTML.toString();
      console.log(content);
      content = content.replace(/lightgreen;/g, "black;");
      content = content.replace(/darkgreen;/g, "black;");
      console.log(content);
      var html = preHtml+content+postHtml;

      var blob = new Blob(['\ufeff', html], {
          type: 'application/msword'
      });

      // Specify link url
      var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

      // Specify file name
      filename = filename?filename+'.doc':'document.doc';

      // Create download link element
      var downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if(navigator.msSaveOrOpenBlob ){
          navigator.msSaveOrOpenBlob(blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = url;

          // Setting the file name
          downloadLink.download = filename;

          //triggering the function
          downloadLink.click();
      }
      document.body.removeChild(downloadLink);

      // backup all embeds after export doc

      for (var i = embedsArray.length - 1; i >= 0 ; i --) {
        this.$refs.mainComp.editor.insertEmbed(embedsArray[i], 'image', '/static/quiz_mark.jpg');
      }

    }
  },
  mounted(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.auth_id = user.uid;
        this.$store.state.auth_id = user.uid;
        this.$store.state.logged_in = true;
      } else {
        this.auth_id = null;
        this.$store.state.auth_id = null;
        this.$store.state.logged_in = false;
      }
    });
  }
}
</script>

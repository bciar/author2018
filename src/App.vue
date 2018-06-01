<template>
    <!-- if the user is not logged in then display this -->
    <v-app id="inspire">
      <v-toolbar v-if="$store.state.logged_in" color="indigo" dark fixed app clipped-right>
        <v-toolbar-title>Vue Organism</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="blue" v-on:click="onSignOut">SignOut</v-btn>
        <v-btn color="blue">Export as *.doc</v-btn>
        <v-btn color="blue">Export as *.xlsx</v-btn>
      </v-toolbar>
      <v-content v-if="!$store.state.logged_in">
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
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
                  <v-btn color="primary" v-on:click="onLogin">SignIn</v-btn>
                  <v-btn color="primary" v-on:click="onSignUp">SignUp</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-content v-else>
        <Main></Main>
      </v-content>
    </v-app>
</template>

<script>
import Main from '@/components/Main'
import firebase from 'firebase'

export default {
  name: 'App',
  data(){
    return{
      name: 'Paul',
      logged_in: false,
      email: '',
      password: '',
      auth_id: '',
      drawer: null
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
        router.push({path: '/login'})
      })
    },
    onLogin() {
      const auth = firebase.auth();
      const promise = firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          user => {
            this.$store.state.logged_in = true;
            this.auth_id = user.uid;
          },
        )
      .catch(
        error => {
          console.log("error");
          alert("Error Login");
          return;
        });

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            this.auth_id = user.uid;
            this.$store.state.auth_id = user.uid;
            console.log("this1 = " +  this.$store.state.auth_id);
            //TextEditor.data.authID = 'f';
        }
      });
    },
    onSignUp(){
      const auth = firebase.auth();
      const promise = firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          user => {
            const newUser = {
              id: user.uid,
              registerMeetUps: []
            }
            this.logged_in = true;
          },
        )
      .catch(
        error => {
          console.log("error");
          alert("SignUp error");
          return;
        });
     }
  },
  mounted(){
    this.$store.state.auth_id = this.auth_id;
  }
}
</script>

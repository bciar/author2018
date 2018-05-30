<template>
    <!-- if the user is not logged in then display this -->
    <v-app id="inspire">
      <v-toolbar v-if="$store.state.logged_in" color="blue-grey" dark fixed app clipped-right>
        <v-toolbar-title>Toolbar</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-on:click="onSignOut">SignOut</v-btn>
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
                  <v-btn color="primary" v-on:click="onLogin">SignUp</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-content v-else>
        <v-container fluid fill-height>
          <router-view xs12 transition="slide-y-reverse-transition"></router-view>
        </v-container>
      </v-content>
              <!--  
                    <div class="body"></div>
                    <div class="grad"></div>
                    <div class="header">
                        <div>Vue<span>Organism</span></div>
                    </div>
                    <br>
                    <div class="login">
                        <input id="txtEmail" type="text" placeholder="username" name="user"><br>
                        <input  id="txtPassword" type="password" placeholder="password" name="password"><br>
                        <input type="button" value="Login"  @click="login()">
                        <input type="button" value="Signup"  @click="signup()">
                    </div>
                -->
          

        <!-- If the user is logged in -->
<!--        <div id="content" v-if="$store.state.logged_in" style="background-color: black; border-style: solid;  height: 70vh;">
            <div id='text_editor' style="width: 710px; margin-left: 500px; margin-right: auto; width: 30%; ">
                <TextEditor ></TextEditor>
            </div>
            <div id='matrix_element' style="">
                <Matrix></Matrix>
            </div>
            <div class="vr"></div>
        </div>-->
    </v-app>
</template>

<script>
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
  methods: {
    onSignOut() {
      this.$store.state.logged_in = false;
      this.$root.user = null
      firebase.auth().signOut().then(function () {
        router.push({path: '/login'})
      })
    },
    // submitName(){
    //   nodesRef.push({name: this.name})
    // },
     onLogin() {
        console.log(this.$store.state.counter);
        console.log(this.email);
        console.log(this.password);

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
    //   this.load();
     },
    // signup(){
    //     const email = txtEmail.value.toString();
    //     console.log("email = " + email);
    //     const pass = txtPassword.value.toString();
    //     console.log("pass = " + pass);
    //     const auth = firebase.auth();
    //     var val = 0;
    //     const promise = firebase.auth().createUserWithEmailAndPassword(email, pass).then(
    //         user => {
    //           const newUser = {
    //             id: user.uid,
    //             registerMeetUps: []
    //           }
    //           this.logged_in = true;
    //           this.sign_in = false;
    //         },
    //       )
    //     .catch(
    //       error => {
    //         console.log("error");
    //         $("#txtResult").empty();
    //         $("#txtResult").append("Error Signing up");
    //         val = 1;
    //         return;
    //       });

    // },
    // load(){
    // }
  },
  // mounted(){
  //     // console.log("this = " + this.auth_id);
  //     // this.$store.state.auth_id = this.auth_id;
  // }
}
</script>

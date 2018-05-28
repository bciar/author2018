<template>
    <!-- if the user is not logged in then display this -->
    <div id="app">
        <div id="login" v-if="!$store.state.logged_in">
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
        </div>

        <!-- If the user is logged in -->
        <div id="content" v-if="$store.state.logged_in" style="background-color: black; border-style: solid;  height: 70vh;">
            <div id='text_editor' style="width: 710px; margin-left: 500px; margin-right: auto; width: 30%; ">
                <TextEditor ></TextEditor>
            </div>
            <div id='matrix_element' style="">
                <Matrix></Matrix>
            </div>
            <div class="vr"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<!-- Script for handling login functionality and switching views -->
<script>
import TextEditor from './components/TextEditor'
import Matrix from './components/Matrix'
import Login from './components/Login'
import jQuery from 'jquery/dist/jquery.js'
import $ from 'jquery/dist/jquery.js'
import modal from 'bootstrap/dist/css/bootstrap.css'
import * as firebase from 'firebase';

export default {
  data(){
    return{
      name: 'Paul',
      logged_in: false,
      sign_in: true,
      email: '',
      password: '',
      auth_id: ''
    }
  },
  methods: {
    submitName(){
      nodesRef.push({name: this.name})
    },
    login(){
       console.log(this.$store.state.counter);

        const email = txtEmail.value.toString();
        console.log("email = " + email);
        const pass = txtPassword.value.toString();
        console.log("pass = " + pass);
        const auth = firebase.auth();
        const promise = firebase.auth().signInWithEmailAndPassword(email, pass).then(
            user => {
              this.$store.state.logged_in = true;
              this.sign_in = false;
              this.auth_id = user.uid;
            },
          )
        .catch(
          error => {
            console.log("error");
            $("#txtResult").empty();
            $("#txtResult").append("Error logging in");
            return;
          });

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            this.auth_id = user.uid;
            this.$store.state.auth_id = user.uid;
            console.log("this1 = " +  this.$store.state.auth_id);
            TextEditor.data.authID = 'f';
        }
      });
      this.load();
    },
    signup(){
        const email = txtEmail.value.toString();
        console.log("email = " + email);
        const pass = txtPassword.value.toString();
        console.log("pass = " + pass);
        const auth = firebase.auth();
        var val = 0;
        const promise = firebase.auth().createUserWithEmailAndPassword(email, pass).then(
            user => {
              const newUser = {
                id: user.uid,
                registerMeetUps: []
              }
              this.logged_in = true;
              this.sign_in = false;
            },
          )
        .catch(
          error => {
            console.log("error");
            $("#txtResult").empty();
            $("#txtResult").append("Error Signing up");
            val = 1;
            return;
          });

    },
    load(){
    }
  },
  name: 'App',
  components: {
    TextEditor, Matrix, Login
  },
  mounted(){
      console.log("this = " + this.auth_id);
      this.$store.state.auth_id = this.auth_id;
  }
}
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Exo:100,200,400);
@import url(https://fonts.googleapis.com/css?family=Source+Sans+Pro:700,400,300);
body{
  margin: 0;
  padding: 0;
  background: #fff;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,0.65))); /* Chrome,Safari4+ */
  color: #fff;
  font-family: Arial;
  font-size: 12px;
}
.body{
  position: absolute;
  top: -20px;
  left: -20px;
  right: -40px;
  bottom: -40px;
  width: auto;
  height: auto;
  background-size: cover;
  -webkit-filter: blur(5px);
  z-index: 0;
}
.grad{
  position: absolute;
  top: -20px;
  left: -20px;
  right: -40px;
  bottom: -40px;
  width: auto;
  height: auto;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(100%,rgba(0,0,0,0.65))); /* Chrome,Safari4+ */
  z-index: 1;
  opacity: 0.7;
}
.header{
  position: absolute;
  top: calc(50% - 35px);
  left: calc(50% - 255px);
  z-index: 2;
}
.header div{
  float: left;
  color: #fff;
  font-family: 'Exo', sans-serif;
  font-size: 35px;
  font-weight: 200;
}
.header div span{
  color: #5379fa !important;
}
.login{
  position: absolute;
  top: calc(50% - 75px);
  left: calc(50% - 50px);
  height: 150px;
  width: 350px;
  padding: 10px;
  z-index: 2;
}
.login input[type=text]{
  width: 250px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 2px;
  color: #fff;
  font-family: 'Exo', sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 4px;
}
.login input[type=password]{
  width: 250px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 2px;
  color: #fff;
  font-family: 'Exo', sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 4px;
  margin-top: 10px;
}
.login input[type=button]{
  width: 260px;
  height: 35px;
  background: #fff;
  border: 1px solid #fff;
  cursor: pointer;
  border-radius: 2px;
  color: #a18d6c;
  font-family: 'Exo', sans-serif;
  font-size: 16px;
  font-weight: 400;
  padding: 6px;
  margin-top: 10px;
}
.login input[type=button]:hover{
  opacity: 0.8;
}
.login input[type=button]:active{
  opacity: 0.6;
}
.login input[type=text]:focus{
  outline: none;
  border: 1px solid rgba(255,255,255,0.9);
}
.login input[type=password]:focus{
  outline: none;
  border: 1px solid rgba(255,255,255,0.9);
}
.login input[type=button]:focus{
  outline: none;
}
::-webkit-input-placeholder{
   color: rgba(255,255,255,0.6);
}
::-moz-input-placeholder{
   color: rgba(255,255,255,0.6);
}
#text_editor{
  border-style: solid;
  border-color: black;
  color: black;
}
#matrix_element{
  border-style: solid;
  border-color: black;
}
</style>

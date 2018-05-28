<template>
  <div class="TextEditor">

  <ul id="secret_stuff" style="display: none;">
  </ul>

<div id ="refresh" style="float:right; width: 60px; background-color: black;"><button id="refresh_button" v-on:click="refresh_data" style="width: 60px;">&#8634;</button>
</div>


<ul class="icetab-container">
  <li class="icetab" id="add_tab" rel="add">+</li> 
  <li v-for="(value, key, index) in tab_names" v-on:click="loadData($event)" class="icetab">{{value}}</li>
</ul>
<div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <h1 style="text-align: center;">Tab Name</h1>
    <input id="tab_input" style="height: 50px;"></input>
    <button id="submit_button" v-on:click="adding_tab">Submit</button>
  </div>

</div>



<div class="tab_container">
     <div class="wrap">
         <div class="toolbar">
   </div>
   <div class="editor" id="editor" contenteditable></div>
  </div>
  <button class="the_submit" id="calculate_info" v-on:click="calculate">Submit2</button>
 

</div>
  

</div>



  </div>
</template>

<script>
  import jQuery from 'jquery/dist/jquery.js'
  import $ from 'jquery/dist/jquery.js'
  import modal from 'bootstrap/dist/css/bootstrap.css'
  import {store} from './store/store.js'
  import * as firebase from 'firebase';
  import json from '../dummy.json'
  import stream from 'stream-json'

export default {
  name: 'TextEditor',
  props: ['userID'],
  state: {
    auth: ''
  },
  data () {
    return {
      authID  : 'd',
      tab_names : [],
      tab_values: [],
      myJson: json

    }
  },

  methods: {  
    refresh_data : function(){
      this.tab_names = [];
      this.tab_values = [];
      console.log("test");

      var ref = firebase.app().database().ref();
      var usersRef = ref.child('users');
      console.log("test2 = " + this.$store.state.auth_id);
      var currUser = usersRef.child(this.$store.state.auth_id);
      var tabList = currUser.child('tabs');


      tabList.on('value', snapshot => { 
        snapshot.forEach(child =>{
          var value = child.val();
          var key = child.key;
          if(!this.tab_names.includes(key)){
           this.tab_names.push(key);
           this.tab_values.push(value);
          }
          })
      });
    },
    adding_tab : function() {
      //console.log("test123");
      //console.log(this.tab_names);
     // this.tab_names.push("new tab");
      // update back end  
      this.authID = this.$store.state.auth_id;
      var ref = firebase.app().database().ref();
      var usersRef = ref.child('users');
      var currUser = usersRef.child(this.$store.state.auth_id);
      var tabList = currUser.child('tabs');

      var input = $("#tab_input").val();
      console.log("text = " + input);

      //var newPostKey = tabList.push().key;
      //console.log("post key = " + newPostKey);
      tabList.child(input).set("Empty");
      console.log("added");
      
    },
    calculate: function() {
      console.log("test5 = " + this.myJson);

      console.log("calculate");
      //console.log($("#editor").text());
      var text = $("#editor").text();

      var makeSource = require("stream-json");
      var source = makeSource();
       
      var fs = require("fs");
       
      var objectCounter = 0;
      source.on("startObject", function(){ ++objectCounter; });
      source.on("end", function(){
          console.log("Found ", objectCounter, " objects.");
      });
       
      var Parser = require("stream-json/Parser");
      var parser = new Parser();
       
      // Example of use:
      var next = fs.createReadStream(this.myJson).pipe(parser);
      console.log("NEXT = " + next);


      console.log(this.myJson.biological_entity[0]);
      //console.log(JSON.parse(text));
/*      var obj = JSON.parse(text);
      console.log(obj.biological_entity[0].name);
      console.log(obj.biological_entity[1].name);
      console.log(obj.biological_entity[0].character[0].value);
      console.log(obj.biological_entity[0].character[1].value);
      console.log(obj.biological_entity[0].character[2].value);
      console.log(obj.biological_entity[0].character[3].value);
      console.log(obj.biological_entity[0].character[4].value);*/

/*
      var name_1 = obj.biological_entity[0].name;
      var name_2 = obj.biological_entity[1].name;*/
/*
      var color = obj.biological_entity[0].character[0].value;
      var value_1 = obj.biological_entity[0].character[1].value;
      var value_2 = obj.biological_entity[0].character[2].value;
      var value_3 = obj.biological_entity[0].character[3].value;
      var value_4 = obj.biological_entity[0].character[4].value;*/
/*


  $("#editor").text("");
  $("#editor").text("The Names are: " + name_1 + "--" + name_2 + "\n The Color is: " + color + " The Values are " + value_1 + " " + value_2 + " " + value_3 + " " + value_4  );  */

    },
    loadData(e) {
      console.log("loading..." + e.target.innerText);
      var i = 0;
      var j = 0;
      $(".icetab").each(function(){
          console.log($(this).text());
          if($(this).text().toLowerCase() == e.target.innerText.toLowerCase()){
            $(this).css("background-color", 'white');
            $(this).css("color", 'Black');
            console.log("i = " + i);
           // $('.editor').html(this.tab_values );
            j = i;
          }
          else{
            $(this).css("background-color", 'black');
            $(this).css("color", 'white');
          }
          i++;
      });
      console.log("j = " + j);
      $('.editor').html(this.tab_values[j]);
    }


  },
  mounted(){
  	var currWord = "";
    var modal = document.getElementById('myModal');
    var span = document.getElementsByClassName("close")[0];
    console.log("auth = " + this.$store.state.tab_list);
      var ref = firebase.app().database().ref();
      var usersRef = ref.child('users');
      console.log("test2 = " + this.$store.state.auth_id);
      var currUser = usersRef.child(this.$store.state.auth_id);
      var tabList = currUser.child('tabs');


      tabList.on('value', snapshot => { 
        snapshot.forEach(child =>{
          var value = child.val();
          var key = child.key;
          if(!this.tab_names.includes(key)){
           this.tab_names.push(key);
           this.tab_values.push(value);
          }
          })
      });


// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("add_tab");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var submit = document.getElementById("submit_button");

// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

submit.onclick = function(){
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}




$(".icetab").click(function(){
  console.log("clickeddk");
  //console.log($(this).val());
  //$(this).css(  "background-color", "white");  
});



$(".adding_tab").click(function(){
  console.log("clicked");
  //console.log(this.state.auth);

});


$(".active").dblclick(function(){
  console.log("clicked");
   $(this).find('input').removeAttr('readonly');
});

      $('input').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
          if(keycode == '13'){
            $(this).attr('readonly', 'readonly');
            //update the database
          }

        });

$("#editor").keypress(function(e){
  // console.log($("#editor").text());
   //if current word equals any description in hash description 
   var check = $("#editor").text();
   currWord += String.fromCharCode(e.which);

  // console.log("currWord = " + currWord);


  	/*
  	 * If the user presses space, then we analyze the word the user just typed before resetting the value of current word
  	 */
    if(e.keyCode == 32){
    	/*
		   * If the user types description -> activate this popup
		   */
        if(currWord.indexOf("description") >= 0){
        	console.log("description targetted");
        	var word = $("#editor").text();
        	$("#editor").remove("description");
        	$("#editor").append("<strong>Description:</strong><br>");
        }
    	/*
		   * If the user types leaf, activate this popup
		   */
        if(currWord.indexOf("leaf") >= 0){
        	console.log("description targetted");
        	var word = $("#editor").text();
        	$("#editor").remove("description");
        	$("#editor").append("<strong>Leaf</strong>");
          modal.style.display = "block";
          currWord ="";

        }

        currWord ="";

    }


});





//calculate
$("#calculate_info").click(function(){
/*  console.log("calculate");
  //console.log($("#editor").text());
  var text = $("#editor").text();
  //console.log(JSON.parse(text));
  var obj = JSON.parse(text);
  console.log(obj.biological_entity[0].name);
  console.log(obj.biological_entity[1].name);
  console.log(obj.biological_entity[0].character[0].value);
  console.log(obj.biological_entity[0].character[1].value);
  console.log(obj.biological_entity[0].character[2].value);
  console.log(obj.biological_entity[0].character[3].value);
  console.log(obj.biological_entity[0].character[4].value);


  var name_1 = obj.biological_entity[0].name;
  var name_2 = obj.biological_entity[1].name;

  var color = obj.biological_entity[0].character[0].value;
  var value_1 = obj.biological_entity[0].character[1].value;
  var value_2 = obj.biological_entity[0].character[2].value;
  var value_3 = obj.biological_entity[0].character[3].value;
  var value_4 = obj.biological_entity[0].character[4].value;



  $("#editor").text("");
  $("#editor").text("The Names are: " + name_1 + "--" + name_2 + "\n The Color is: " + color + " The Values are " + value_1 + " " + value_2 + " " + value_3 + " " + value_4  );  */




/*  var name = obj.biological_entity[0].name;
  var id = obj.biological_entity[0].id;
  var name_original = obj.biological_entity[0].name_original;
  var type = obj.biological_entity[0].type;
  var color =  obj.biological_entity[0].name;*/
});

     // tabbed content
    $(".tab_content").hide();
    $(".tab_content:first").show();

  /* if in tab mode */
    $("ul.tabs li").click(function() {
    
      $(".tab_content").hide();
      var activeTab = $(this).attr("rel"); 
      $("#"+activeTab).fadeIn();    
    
      $("ul.tabs li").removeClass("active");
      $(this).addClass("active");

    $(".tab_drawer_heading").removeClass("d_active");
    $(".tab_drawer_heading[rel^='"+activeTab+"']").addClass("d_active");
    
    });
  /* if in drawer mode */
  $(".tab_drawer_heading").click(function() {
      
      $(".tab_content").hide();
      var d_activeTab = $(this).attr("rel"); 
      $("#"+d_activeTab).fadeIn();
    
    $(".tab_drawer_heading").removeClass("d_active");
      $(this).addClass("d_active");
    
    $("ul.tabs li").removeClass("active");
    $("ul.tabs li[rel^='"+d_activeTab+"']").addClass("active");
    });
  
  
  /* Extra class "tab_last" 
     to add border to right side
     of last tab */
  $('ul.tabs li').last().addClass("tab_last");
  


  }
}

</script>

<style scoped>
body {
   background: #525764;
   font-family: Arial, sans-serif;
   font-size: 16px;
   background-color: black;
}

.wrap {
   width: 70%;
   min-width: 562px;
   margin-left: 10%;
   background: #fafafa;
   border-radius: 8px;
   box-shadow: 0 5px 8px 0 rgba(0,0,0,.4);
   padding: 10px;
}

.toolbar {
   width: 100%;
   margin: 0 auto 10px;
}

button {
   width: 30px;
   height: 30px;
   border-radius: 3px;
   background: none;
   border: none;
   box-sizing: border-box;
   padding: 0;
   font-size: 20px;
   color: #a6a6a6;
   cursor: pointer;
   outline: none;
}

button:hover {
   border: 1px solid #a6a6a6;
   color: #777;
}

#bold,
#italic,
#underline {
   font-size: 18px;
}

#underline,
#align-right {
   margin-right: 17px;
}

#align-left {
   margin-left: 17px;
}

select {
   height: 24px;
   font-size: 15px;
   font-weight: bold;
   color: #444;
   background: #fcfcfc;
   border: 1px solid #a6a6a6;
   border-radius: 3px;
   margin: 0;
   outline: none;
   cursor: pointer;
}

select > option {
   font-size: 15px;
   background: #fafafa;
}

#fonts {
   width: 140px;
}

.sp-replacer {
   background: #fcfcfc;
   padding: 1px 2px 1px 3px;
   border-radius: 3px;
   border-color: #a6a6a6;
   margin-top: -1px;
}

.sp-replacer:hover {
   border-color: #a6a6a6;
   color: inherit;
}

.sp-preview {
   width: 15px;
   height: 15px;
   border: none;
   margin-top: 2px;
   margin-right: 3px;
}

.sp-preview-inner, 
.sp-alpha-inner, 
.sp-thumb-inner {
   border-radius: 3px;
}

.editor {
   position: relative;
   width: 100%;
   height: 50vh;
   margin: 0 auto;
   padding: 20px;
   background: #fcfcfc;
   border-radius: 3px;
   box-shadow: inset 0 0 8px 1px rgba(0,0,0,.2);
   box-sizing: border-box;
   overflow: hidden;
   word-break: break-all;
   outline: none;
}
  ul.tabs {
  margin: 0;
  padding: 0;
  float: left;
  list-style: none;
  height: 32px;
  border-bottom: 1px solid #333;
  width: 100%;
}

ul.tabs li {
  float: left;
  margin: 0;
  cursor: pointer;
  padding: 0px 21px;
  height: 31px;
  line-height: 31px;
  border-top: 1px solid #333;
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
  background-color: #666;
  color: #ccc;
  overflow: hidden;
  position: relative;
}

.tab_last { border-right: 1px solid #333; }

ul.tabs li:hover {
  background-color: #ccc;
  color: #333;
}

ul.tabs li.active {
  background-color: #fff;
  color: #333;
  border-bottom: 1px solid #fff;
  display: block;
}

.tab_container {
  border: 1px solid #333;
  border-top: none;
  clear: both;
  float: left;
  width: 100%;
  background: #fff;
  overflow: auto;
  margin-top: 20px;
}

.tab_content {
  padding: 20px;
  display: none;
}

.tab_drawer_heading { display: none; }

@media screen and (max-width: 480px) {
  .tabs {
    display: none;
  }
  .tab_drawer_heading {
    background-color: #ccc;
    color: #fff;
    border-top: 1px solid #333;
    margin: 0;
    padding: 5px 20px;
    display: block;
    cursor: pointer;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .d_active {
    background-color: #666;
    color: #fff;
  }
}


input{
  background-color: black;
  color: white;
  text-align: center;
  outline: none;
    box-shadow: none;

}

.the_submit{
  background-color: black;
  float: right;
  color: white;
  width: 100px;
  margin-bottom: 10px;
  margin-right: 80px;
}


. input{
  cursor: pointer;
}


/* The Modal (background) */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

#submit_button{
  float:right;
  width: 50px;
}



















div {
  box-sizing: border-box;
  transition: all ease-in-out .5s;
  -moz-transition: all ease-in-out .5s;
  -webkit-transition: all ease-in-out .5s;
}
.icetab {
  border: 2px solid #ff9900;
  display: inline-block; 
  border-bottom: 0px; 
  margin: 0px;  
  color: #fff;
  cursor: pointer;
  border-right: 0px;
  background-color: black;
  margin-right: 4px;
}
.icetab:last-child {
  border-right: 2px solid #ff9900;  
}

.icetab-container {
  background-color: white;
}

#icetab-content {
  overflow: hidden;
  position: relative;
  border-top: 2px solid #ff9900;
  background-color:white;
}


.tabcontent {
  position: absolute;
  left: 0px;
  top: 0px;
  background: #fff;
  width: 100%;
  border-top: 0px;
  border: 2px solid #ff9900;
  border-top: 0px;
  transform: translateY(-100%);
  -moz-transform: translateY(-100%);
  -webkit-transform: translateY(-100%);
}

.tabcontent:first-child {
  position: relative; 
}
.tabcontent.tab-active {
  border-top: 0px;
  display: block;
  transform: translateY(0%);
  -moz-transform: translateY(0%);
  -webkit-transform: translateY(0%);
}


/* A tiny wee bit of visual formating for tabs */
body {
  font-family: Segoe, "Segoe UI", "DejaVu Sans", "Trebuchet MS", Verdana, sans-serif; 
  background-color: black;
  color: #454545;
}
.codepen-container {
  max-width: 700px;
  margin: 40px;
  margin-left: auto;
  margin-right: auto;
}
.title {
  color: #ff9900;
  text-align: center;
  letter-spacing: 14px;
  text-transform: uppercase;
  font-size: 17px;
  margin: 40px 0px;
}
.tabcontent {
  padding: 40px;
}
.icetab {
  padding: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}


</style>

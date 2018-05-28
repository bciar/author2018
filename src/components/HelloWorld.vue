<template>
  <div>
    <div id='searchBar'>
  <form class="searchform group">
  <label for="search-box">
    <span class="fa fa-2x fa-search"></span>
  </label>
  <input type="search" id="search-box" placeholder="Search">
  </form>
    </div>
   <table>
    <tr>
      <th></th>
      <th>Type</th>
      <th>Color</th>
      <th>Size</th>
    </tr>
   <tbody id="table">
    <tr id='Leaf'>
      <td class='elementName'>Leaf</td>
      <td class='element'><input type='text' class='elementValue' value='1' readonly></input>
        <p class='description'></p></td>
      <td class='element'><input type='text' class='elementValue' value='1' readonly></input>
      <p class='description'></p></td>
      <td class='element'><input type='text' class='elementValue' value='1' readonly></input>
      <p class='description'></p></td>
    </tr>
    <tr id='Tree'>
      <td class='elementName'>Tree</td>
      <td class='element'><input type='text' class='elementValue' value='2' readonly></input>
      <p class='description'></p></td>
      <td class='element'><input type='text' class='elementValue' value='2' readonly></input>
      <p class='description'></p></td>
      <td class='element'><input type='text' class='elementValue' value='2' readonly></input>
      <p class='description'></p></td>
    </tr>
    </tbody>
  </table> 

  </div>
</template>

<script>
  import jQuery from 'jquery/dist/jquery.js'
  import $ from 'jquery/dist/jquery.js'
  import modal from 'bootstrap/dist/css/bootstrap.css'
  export default {
      name: 'HelloWorld',
      data () {
        return {
          msg: 'Welcome to Your Vue.js App'
        }
      },
        mounted () {
        this.$nextTick(() => {
          console.log('test = ' + $('.element').html())
        });

var currNode;

$('body').on('click', '.element', function(e){
  e.preventDefault();
  e.stopPropagation();  
  console.log("this currently = " + $(this).find('input').val());
  $(this).find('input').removeAttr('readonly');

  //on Enter
  //make it readonly again
});

$("#search-box").keyup(function(){
      var input, filter, ul, li, a, i;
      input = document.getElementById('search-box');
      filter = input.value.toUpperCase(); 
      ul = document.getElementById("table");
      li = ul.getElementsByTagName('tr');

      console.log("filter = " + filter);
      console.log("li.length = " + li.length);

      /* Loop through all list items, and hide those who don't match the search query */
      for (i = 1; i < li.length + 1; i++) {
          //a = document.getElementById("search-box").getElementsByTagName("tr")[i].innerHTML;
          a = $('tr').eq(i).text().trim();
          console.log("a = " + $('tr').eq(i).text().trim());
          if(a.toUpperCase().indexOf(filter) > -1){
              //document.getElementById("search-box").getElementsByTagName("tr")[i].style.display = "";
              $("tr").eq(i).css("display", "");
          }
          else{
              //document.getElementById("search-box").getElementsByTagName("tr")[i].style.display = "none";
              $("tr").eq(i).css("display", "none");
 
          }
      }
   });
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body{
    font-family:'Open Sans', sans-serif;
  background:#efefef;
  text-transform: uppercase;
}

p:first-of-type {
  font-size: 1.25em;
}

.spread_sheet {
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  font-size: 90%;
  color: #333;
  justify-content: center;
}

.table-wrapper {
  max-width: 700px;
  overflow: scroll;
}

table {
  border: 1px solid #ddd;
  border-collapse: collapse;
}

td,
th {
  white-space: nowrap;
  border: 1px solid #ddd;
  padding: 20px;
}

th {
  background-color: #eee;
  position: sticky;
  top: -1px;
  z-index: 2;

  &:first-of-type {
      left: 0; 
      z-index: 3;
  }
}

tbody tr td:first-of-type {
  background-color: #eee;
  position: sticky;
  left: -1px;
  text-align: left;
}

/* on hover */

td:not(:nth-child(1)):hover {
  background-color: black;
}


.elementValue{
  width: 100%;
}

.elementValue:hover{
  background-color: #007bff;
}

label{
    width: 80px;
    text-align: right;
}

#er{
  width: 50px;
  height: 50px;
}

#close{
  width: 25px;
  height: 25px;
}

.modal-title{
  text-align: center;
}



body {

}

.base {
  font-size: 1.8em;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
      -ms-flex-direction: row;
          flex-direction: row;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-perspective: 1000px;
          perspective: 1000px;
  height: 3em;
  width: 3em;
  margin: 0 auto;
  -webkit-perspective-origin: 50% 50%;
          perspective-origin: 50% 50%;
  -webkit-transition: -webkit-transform 1s ease-in-out, -webkit-perspective-origin 1s ease-in-out;
          transition: transform 1s ease-in-out, perspective-origin 1s ease-in-out;
  -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
}

.box {
  display: block;
  font-size: 1em;
  position: absolute;
  height: 2em;
  width: 2em;
  -webkit-transition: -webkit-transform 1s ease-in-out;
          transition: transform 1s ease-in-out;
  -webkit-transform: rotateX(-30deg) rotateY(-135deg);
          transform: rotateX(-30deg) rotateY(-135deg);
  -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
}

.box .face {
  position: relative;
  bottom: 0;
  width: 2em;
  height: 2em;
}
.box .side-0,
.box .side-1 {
  overflow: hidden;
  height: 2em;
}
.box .side-0 {
  -webkit-transform: rotateY(90deg) translateZ(1em);
          transform: rotateY(90deg) translateZ(1em);
  background-color: rgb(241, 241, 241);
}
.box .side-1 {
  -webkit-transform: rotateY(180deg) translateY(-2em) translateZ(1em);
          transform: rotateY(180deg) translateY(-2em) translateZ(1em);
  background-color: rgb(216, 216, 216);
}
.box .top {
  -webkit-transition: box-shadow .3s ease-in-out;
          transition: box-shadow .3s ease-in-out;
  -webkit-transform: rotateX(90deg) translateZ(5em);
          transform: rotateX(90deg) translateZ(5em);
  background-color: rgb(255, 255, 255);
}
.box .bottom {
  -webkit-transform: rotateX(-90deg) translateY(0em) translateZ(-5em) rotate(180deg);
          transform: rotateX(-90deg) translateY(0em) translateZ(-5em) rotate(180deg);
  -webkit-transition: box-shadow 1.2s;
          transition: box-shadow 1.2s;
}


.base:hover {
  -webkit-perspective-origin: 50% 0%;
          perspective-origin: 50% 0%;
}

.box:hover .top::after {
  content: "";
  display: block;
  height: 2em;
  width: 2em;
  background-color: rgba(218,226,237, .5);
}

.box:focus .top {
  -webkit-transform: rotateX(90deg) translateZ(calc(5em + 1.2px)) !important;
          transform: rotateX(90deg) translateZ(calc(5em + 1.2px)) !important;
}

.base:hover .box:focus .top {
  box-shadow: 0 0 1px #127f95, 0 1px 1px #127f95, 1px 0 1px #127f95, -1px 0 1px #127f95, 0 -1px 1px #127f95, 1px -1px 1px #127f95, 1px 1px 1px #127f95, -1px -1px 1px #127f95, -1px 1px 1px #127f95;
}

.box:first-of-type .bottom {
  box-shadow: 0 0 .75em rgba(0, 0, 0, 0.3);
}

.base:hover .box:first-of-type .bottom {
  box-shadow: none;
}

.base:hover .box .bottom {
  box-shadow: 0 0 1.5em rgba(0, 0, 0, 0.3);
}

.box:nth-of-type(1) .top { background-color: rgb(139,0,0); z-index: 10; }
.box:nth-of-type(2) .top { background-color: rgb(165,42,42); z-index: 11; }
.box:nth-of-type(3) .top { background-color: rgb(178,34,34); z-index: 12; }
.box:nth-of-type(4) .top { background-color: rgb(220,20,60); z-index: 13; }
.box:nth-of-type(5) .top { background-color: rgb(255,0,0); z-index: 14; }
.box:nth-of-type(6) .top { background-color: rgb(255,99,71); z-index: 15; }
.box:nth-of-type(7) .top { background-color: rgb(255,127,80); z-index: 16; }
.box:nth-of-type(8) .top { background-color: rgb(205,92,92); z-index: 17; }
.box:nth-of-type(9) .top { background-color: rgb(240,128,128); z-index: 18; }
.box:nth-of-type(10) .top { background-color: rgb(233,150,122); z-index: 19; }
.box:nth-of-type(11) .top { background-color: rgb(250,128,114); z-index: 20; }
.box:nth-of-type(12) .top { background-color: rgb(255,160,122); z-index: 21; }
.box:nth-of-type(13) .top { background-color: rgb(255,69,0); z-index: 22; }
.box:nth-of-type(14) .top { background-color: rgb(255,140,0); z-index: 23; }
.box:nth-of-type(15) .top { background-color: rgb(255,165,0); z-index: 24; }
.box:nth-of-type(16) .top { background-color: rgb(255,215,0); z-index: 25; }
.box:nth-of-type(17) .top { background-color: rgb(184,134,11); z-index: 26; }
.box:nth-of-type(18) .top { background-color: rgb(218,165,32); z-index: 27; }
.box:nth-of-type(19) .top { background-color: rgb(238,232,170); z-index: 28; }
.box:nth-of-type(20) .top { background-color: rgb(189,183,107); z-index: 29; }
.box:nth-of-type(21) .top { background-color: rgb(240,230,140); z-index: 30; }
.box:nth-of-type(22) .top { background-color: rgb(128,128,0); z-index: 31; }
.box:nth-of-type(23) .top { background-color: rgb(255,255,0); z-index: 32; }
.box:nth-of-type(24) .top { background-color: rgb(154,205,50); z-index: 33; }
.box:nth-of-type(25) .top { background-color: rgb(85,107,47); z-index: 34; }

.box:last-of-type .top { background-color: rgb(255,255,255); }

.base:hover .box_x-4_z-4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(-4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(-4em);}
.base:hover .box_x-2_z-4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(-4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(-4em);}
.base:hover .box_x0_z-4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(-4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(-4em);}
.base:hover .box_x2_z-4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(-4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(-4em);}
.base:hover .box_x4_z-4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(-4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(-4em);}

.base:hover .box_x-4_z-2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(-2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(-2em);}
.base:hover .box_x-2_z-2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(-2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(-2em);}
.base:hover .box_x0_z-2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(-2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(-2em);}
.base:hover .box_x2_z-2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(-2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(-2em);}
.base:hover .box_x4_z-2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(-2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(-2em);}

.base:hover .box_x-4_z0 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(0em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(0em);}
.base:hover .box_x-2_z0 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(0em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(0em);}
.base:hover .box_x0_z0 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(0em);transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(0em);}
.base:hover .box_x2_z0 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(0em);transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(0em);}
.base:hover .box_x4_z0 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(0em);transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(0em);}

.base:hover .box_x-4_z2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(2em);}
.base:hover .box_x-2_z2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(2em);}
.base:hover .box_x0_z2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(2em);}
.base:hover .box_x2_z2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(2em);}
.base:hover .box_x4_z2 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(2em);transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(2em);}

.base:hover .box_x-4_z4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-4em) translateZ(4em);}
.base:hover .box_x-2_z4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(-2em) translateZ(4em);}
.base:hover .box_x0_z4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(0em) translateZ(4em);}
.base:hover .box_x2_z4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(2em) translateZ(4em);}
.base:hover .box_x4_z4 {-webkit-transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(4em);transform: rotateX(-30deg) rotateY(-135deg) translateX(4em) translateZ(4em);}

table{
  clear: both;
}


#search-box{
  float: left;
}

</style>

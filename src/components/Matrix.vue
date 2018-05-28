<template>
  <div id="matrix">
<!--      <div v-for="data in myJson" id="json_content">{{data}}</div>
 -->     <div id='searchBar'>
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
  import json from '../dummy.json'

  export default {
      name: 'Matrix',
      data () {
        return {
          myJson: json
        }
      },
      mounted () {
      this.$nextTick(() => {
        console.log('test = ' + $('.element').html())
      });

      var currNode;
      $(document).ready(function(){

      });

      /*
       * Function that allows user to edit field
       */
      $('body').on('click', '.element', function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("this currently = " + $(this).find('input').val());
        $(this).find('input').removeAttr('readonly');
        console.log(this.data);

      });

      /*
       * On enter, remove readonly attr and update database
       */
      $('input').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which);
          if(keycode == '13'){
            $(this).attr('readonly', 'readonly');
            //update the database
          }

        });

      /*
       * Search Function
       */
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
  float: left;
}

td,
th {
  white-space: nowrap;
  border: 1px solid #ddd;
  padding: 20px;
 /* width: 185px;
 */
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
  color:white;
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

table{
  clear: both;
}


#search-box{
  float: left;
}



#random {
  float: right;
  font-size: 4em;
  width: 10%;
  text-align: center;
  cursor: pointer;
}

@keyframes rotate {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.animated {
  animation: rotate .3s ease-out 0s;
}

#line {
  background-color: white;
  width: 100%;
  height: 8px;
  margin: 20px auto 5px auto;
  transition: background-color .5s ease-out 0s;
  border-style: solid;
}

#tip {
  color: grey;
  float: right;
  margin-right: 3%;
}


#header{
  text-align: center;
}

.searchform {
  display: block;
  margin: 0;
  overflow: hidden;
  width: 50%;
   margin-right: auto; margin-left: auto;
   color: white;
}
label, input {
  vertical-align: baseline;
  color: #737373;
}
label {
  margin: 0.125em 0.125em 0 0;
  float: right;

}
input[type="search"] {
  border: 2px solid #737373;
  border-width: 0 0 3px;
  background-color: transparent;
  font: 22px "Open Sans", sans-serif;
  padding: 0.125em 0.225em;
  width: 85%;
  text-align: center;

}
input[type="search"]:focus {
  color: white;
  border-color: white;
  outline: none;
}

table{
    margin: 0 auto;
    text-align: left;
    margin-top: 30px;
    margin-left: 150px;
    }


td{
  width: 100px;
}


#matrix{
      resize: both;
    overflow: auto;
    width:;
    height:;
}

</style>

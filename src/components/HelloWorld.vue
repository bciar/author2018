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
  //import $ from 'jquery/dist/jquery.js'
  //import modal from 'bootstrap/dist/css/bootstrap.css'
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

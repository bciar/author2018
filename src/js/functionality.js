console.log("test");

var currNode;

$('body').on('dblclick', '.element', function(e){
    e.preventDefault();
    e.stopPropagation();
  $('#myModal').modal('show');
    console.log("clicked");
    console.log("this = " + $(this).parent().html());
    console.log("first = " + $(this).parent().find('.element').eq(0).text());
    console.log("second = " + $(this).parent().find('.element').eq(1).text());
    console.log("third = " + $(this).parent().find('.element').eq(2).text());

    
    //setting the values
    var processName = $(this).parent().find('.element').eq(0).text();
    processName = processName.replace(/\s/g, '');
    var processSize =  $(this).parent().find('.element').eq(1).text();
    processSize = processSize.replace(/\s/g, '');
    currNode = $(this).parent();
    console.log("currNode = " + currNode.html());

    document.getElementById("modal_list_input_name").value = processName;
    document.getElementById("modal_list_input_size").value = processSize;
    //add loading functions value
});

//clicking process name
$('body').on('click', '#modal_list_input_name', function(e){
    e.preventDefault();
    e.stopPropagation();
    console.log("clicked name");
});


//clicking process size
$('body').on('click', '#modal_list_input_size', function(e){
    e.preventDefault();
    e.stopPropagation();
    console.log("clicked size");
});



$('body').on('click', '#modal_list_save', function(e){
    e.preventDefault();
    e.stopPropagation();
    console.log("clicked submit");

    //register value of name
    var currNameVal =document.getElementById("modal_list_input_name").value;
    //update server

    //register value of size
    var currSizeVal = document.getElementById("modal_list_input_size").value;
    //update server
    //register value of summary

    console.log("currNode = " + currNode.find('.element').eq(0).text());
    //setting value of name
    currNode.find('.elementValue').eq(0).val(currNameVal);
    currNode.find('.elementValue').eq(2).val(currSizeVal);

 	$('#myModal').modal('hide');
});


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
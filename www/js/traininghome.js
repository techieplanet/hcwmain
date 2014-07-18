/**********************
*   Populates the Training Home/Landing Page with details of categories and their modules
*    in the database
*   Opens database, load for categories data and display it on a list.
*   Displays first category modules in content area
**********************/

$(document ).delegate("#traininghomepage", "pageinit", function() {
        globalObj.db.transaction(queryCategories,
                                function(error){console.log('Database error: ' + JSON.stringify(error));
                            }
                       );    
 });
  
 function queryCategories(tx){
    tx.executeSql('SELECT * FROM cthx_category',[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    if(len>0){  //if not empty table
                        console.log('Categories length: ' + len);
                        var html = '<ul id="sidebar_ul">';
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             html += '<li>' +
                                        '<a href="" onclick="changeToModule(' + row['category_id']+ '); return false;">' +
                                            row['category_name']    +
                                        '</a>' +
                                     '</li>';
                        }
                        
                        html += '</ul>';  //close ul
                    }
                    else{
                        html += '</ul>';  //close ul
                    }
                     
                    $("#sidebar").html(html);  
                    $("#traininghomepage").trigger("create");  
                }
           );
                
 }
 
function changeToModule(cat_id){
    _categoryID = cat_id;
    //$.mobile.changePage( "modules.html", { transition: "slide"} );    
    $.mobile.changePage( "modules.html");    
}

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
                           
                    $('div[data-role="collapsible"]').trigger("collapse");

        //$('#moduletitle a').attr('onclick','return false;');
//        
//        $('#moduletitle').attr('onclick','return false;');
//        $('#moduletitle').click(function(){
//            alert('module titlie');
//        });
 });

$( document ).delegate("#traininghomepage", "pageshow", function() {
    
        
    $('#sidebar_ul li a').click(function(){
        $('#sidebar_ul li a').removeClass('active');
        $(this).addClass('active');
    });
    
//    $('#traininghomepage .moduletitle').click(function(e){
//        //e.preventDefault();
//        //console.log($(this).parent())
//        var collapsible = $(this).next('.ui-collapsible-content');
//        
//        collapsible.one('expand',function(){
//            //console.log('expanded')
//            $('div.ui-collapsible-content').trigger("collapse");
//            $(this).slideDown(600, function(){
//                $(this).trigger("expand");
//            })
//        });
//        
//        collapsible.one('collapse',function(){console.log('collapsed')})
//    });
});

function moduleSlide(){
        var animationSpeed = 600;
        
        
        console.log($(this).parent())
//        $(this).parent().slideToggle(animationSpeed,function () {
//            // trigger original event and attach the animation again;
//            console.log('animation triggered');
//            $(this).parent().trigger("expand");
//        });

         
}

 function queryCategories(tx){
    tx.executeSql('SELECT * FROM cthx_category',[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    if(len>0){  //if not empty table
                        //console.log('Categories length: ' + len);
                        var html = '<ul id="sidebar_ul">';
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             html += '<li>' +
                                        '<a href="" onclick="loadModule(' + row['category_id']+ '); return false;">' +
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
 
 
 function toggleTopics(){
     alert('toggleTopics');
 }
 
function loadModule(cat_id){
    
    globalObj.categoryID = cat_id;
    globalObj.db.transaction(populateModule,function(error){alert("error populating modules.")});
    
    $('#collapsible_content').html('');
}

function populateModule(tx){
    var query = 'SELECT * FROM cthx_training_module m JOIN cthx_category c ON m.category_id=c.category_id AND m.category_id='+ globalObj.categoryID;
    //console.log('mods: ' + query);
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        //console.log('mods len: ' + len);
                        if(len>0){
                            for(var i=0; i<len; i++){

                                //closure
                                (function(i){
                                    var row = result.rows.item(i);
                                    //console.log(row)
                                    $('.c-title').html(row['category_name']);
                                    
                                    setTimeout(function(){
                                        globalObj.moduleID = row['module_id'];
                                        globalObj.moduleTitle = row['module_title'];
                                        globalObj.db.transaction(populateTopic);
                                    },i*500);
                                    
                                })(i);
                                
                                
                                
                            }//end for
                        }//end ifd
                        else{
                            $('focus-area').html('<p>No modules found.</p>');
                        }
                        
                        
                    }
            );
}


var html ='';
function populateTopic(tx){
    var query = 'SELECT * FROM cthx_training WHERE module_id=' + globalObj.moduleID;
    //console.log('topics : ' + query);
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        
                        //var empty = len>0 ? '' : 'empty';
                        html += '<div id="coll_mod_'+ globalObj.moduleID + '" data-role="collapsible" data-icon="arrow-d" data-iconpos="right"  class="c-inner-content">';
                        html += '<h1 class="moduletitle" >' + globalObj.moduleTitle + '</h1>';
                            
                        if(len==0)
                            html += '<p><a href="#"> No training topics found. </a></p>';
                        
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);
                            html += '<p><a onclick="topicStarter(' + row['training_id'] + '); return false;" href="#">' + row['training_title'] + '</a></p>';
                        }
                        
                        html += '</div>';
                        //console.log(html);
                        $('#collapsible_content').append(html);
                        
                        $('#coll_mod_'+ globalObj.moduleID).trigger('create');
                        $('#collapsible_content').trigger('create');
                        html='';
                    }
                );
                    
}


function topicStarter(topic_id){
    globalObj.topicID = topic_id; //selected topic id
    
    if(globalObj.loggedInUserID > -1){  //user is logged in, group is 0
        $.mobile.changePage( "training.html" );
    }
    else{
        $('#sessionPopup').popup('open');
    }
}


function sessionPick(){    
    var selection = $("input[name='session-choice']:checked").val();
    
    if(selection == 'individual'){
        globalObj.sessionType = 1;
        globalObj.loginMode = 'training';
        $.mobile.changePage( "login.html?pagemode=1" );
    }
    else if(selection == 'group'){
        globalObj.sessionType = 2;
        $.mobile.changePage( "login.html?pagemode=2");
    }
}        
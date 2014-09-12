$( document ).delegate("#traininghomepage", "pagebeforecreate", function() {    
    createHeader('traininghomepage','Trainings');
    createFooter('traininghomepage');
    setNotificationCounts();
});

$( document ).delegate("#traininghomepage", "pageshow", function() {    
        setHeaderNotificationCount('traininghomepage');
        
        //set active sidebar element on click
        $('#sidebar_ul li a').click(function(){
            $('#sidebar_ul li a').removeClass('active');
            $(this).addClass('active');
        });
        
        /*
         *  This displays the category list on sidebar. The delay is necessary to ensure that the 
         *  page DOM has completely loaded before attaching the  list
         */
        setTimeout(function(){
            globalObj.db.transaction(
                    queryCategories,
                    function(error){
                            console.log('Database error: ' + JSON.stringify(error));
                        });
        },200);
        
            //////////  COLLAPSIBLE ...........
            if($("body").data('trainingHomeData')!=null){
                //console.log('body data pageshow: ' + JSON.stringify($("body").data('trainingHomeData')));
                //console.log('body data pageshow cat: ' + $("body").data('trainingHomeData')[0]);
                //console.log('body data pageshow mod: ' + $("body").data('trainingHomeData')[1]);

                //set the right category as active
                $('#cat_'+$("body").data('trainingHomeData')[0]).addClass('active');
                
                //load the modules for the caategory selected
                loadModule($("body").data('trainingHomeData')[0]);
                
                //expand the right module
                
                setTimeout(function(){
                    $('div#coll_mod_'+ $("body").data('trainingHomeData')[1]).trigger("expand");
                 },500);
            }
            //////////  COLLAPSIBLE ...........
        


});

$( document ).delegate("#traininghomepage", "pagebeforeshow", function() {    
    
    
});


/**********************
*   Populates the Training Home/Landing Page with details of categories and their modules
*    in the database
*   Opens database, load for categories data and display it on a list.
*   Displays first category modules in content area
**********************/
$(document ).delegate("#traininghomepage", "pageinit", function() {           
        //set the current page id
        globalObj.currentPage = 'traininghomepage';
        
        /*
         *  PageMode 2: retake training mode
         */
        //sterilize the retakemode variable first to be sure no confusion 
        //globalObj.retakeMode = false;
        var pageModeArray = $('#traininghomepage').attr('data-url').split('?');
        if(pageModeArray.length>1){
            pageMode = pageModeArray[1].split('=')[1];
            if(pageMode=='2')
              //globalObj.retakeMode = true;
              //setUpRetake();
              var trainingHomeData = [globalObj.categoryID,globalObj.moduleID]
              $("body").data( "trainingHomeData" , trainingHomeData);
        }
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
    console.log('categoryID: ' + globalObj.categoryID + ' moduleID: ' + globalObj.moduleID + ' topicID: ' + globalObj.topicID);
        
    tx.executeSql('SELECT * FROM cthx_category',[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html = '';  //'<ul id="sidebar_ul">';
                    if(len>0){  //if not empty table
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             html += '<li>' +
                                        '<a id="cat_' + row['category_id'] + '" href="" onclick="loadModule(' + row['category_id']+ '); return false;">' +
                                            row['category_name']    +
                                        '</a>' +
                                     '</li>';
                        }                        
                    }
                    
                    console.log('html: ' + html);
                    
                    $('#sidebar_ul').html(html);
                    
                    
                    
                    //$("#traininghomepage").trigger("create");
                    
                }
           );
 }
 
 
 function expand(){
     console.log('expanding' );
     //$('#coll_mod_1').collapsible( "option", "collapsed", false )
     $('#coll_mod_1').collapsible( "option", "expand", true )
     //$('#coll_mod_1').attr('data-collapsed','false');
 }
 
 
 function toggleTopics(){
     alert('toggleTopics');
 }
 
function loadModule(cat_id){
    
    globalObj.categoryID = cat_id;
    globalObj.db.transaction(populateModule,function(error){alert("error populating modules " + JSON.stringify(error))});
    
    $('#collapsible_content').html('');
}

function populateModule(tx){

    $('#traininghomepage #collapsible_content').empty();
    $('#traininghomepage #collapsible_content').html('');
    $('#traininghomepage #context-bar').parent().removeClass('hidden');
    //return;
    
    var query = 'SELECT * FROM cthx_training_module m JOIN cthx_category c ON m.category_id=c.category_id AND m.category_id='+ globalObj.categoryID;
    //console.log('mods: ' + query);
    //initialize the html var - important
    html = '';
    
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
                                        
//                                        if((i==(len-1)) && globalObj.retakeMode==true){
//                                            setTimeout(function(){
//                                                $('#coll_mod_'+ globalObj.moduleID).trigger("expand");
//                                            },500);
//                                        }
                                    },i*200);
                                    
                                    
                                })(i);
                                
                                
                                
                            }//end for
                        }//end ifd
                        else{
                            $('.focus-area').html('<p>No modules found for this category.</p>');
                        }
                        
                        
                    }
            );
}


/*
 * This method retrieves the topics for each module and registers it under the module 
 * in the interface collapsible.
 * Tables: training, training_to_module, module
 */
var html ='';  //important
function populateTopic(tx){
    var query = 'SELECT * FROM cthx_training_to_module tm JOIN cthx_training t JOIN cthx_training_module m ' +
                'WHERE t.training_id=tm.training_id AND m.module_id=tm.module_id ' + 
                'AND tm.module_id=' + globalObj.moduleID;
    //console.log('topics : ' + query);
    
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        //console.log(globalObj.moduleID + ' len: ' + len);
                        //var empty = len>0 ? '' : 'empty';
                        html += '<div id="coll_mod_'+ globalObj.moduleID + '" data-role="collapsible" data-icon="arrow-d" data-iconpos="right" data-collapsed="true" class="c-inner-content">';
                        html += '<h1 class="moduletitle" >' + globalObj.moduleTitle + '</h1>';
                            
                        if(len==0)
                            html += '<p><a href="#"> No training topics found for this module. </a></p>';
                        
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);
                            html += '<p><a onclick="topicStarter(' + row['training_id'] + ',' + globalObj.moduleID + '); return false;" href="#">' + row['training_title'] + '</a></p>';
                        }
                        
                        html += '</div>';
                        //console.log(html);
                        $('#traininghomepage #collapsible_content').append(html);
                        
                        $('#traininghomepage #coll_mod_'+ globalObj.moduleID).trigger('create');
                        $('#traininghomepage #collapsible_content').trigger('create');
                        html='';
                    }
                );
                    
}


function topicStarter(topic_id,module_id){
    globalObj.topicID = topic_id; //selected topic id
    globalObj.moduleID = module_id;
    
    //set body traininghome data
    var trainingHomeData = [globalObj.categoryID,globalObj.moduleID]
    $("body").data( "trainingHomeData" , trainingHomeData);
    //console.log('body data: ' + JSON.stringify($("body").data()));
    
    if(globalObj.loggedInUserID > 0){  //user is logged in, group is 0
        $.mobile.changePage( "training.html" );
    }
    else{  //not logged in
        console.log('topicStarter usersCount: ' + globalObj.usersCount);
        //first off, find out if number of registered users is greater than 1. 
        //If not >1, no need to ask session type
        if(globalObj.usersCount > 1){  //more than one user
            $('#sessionPopup').popup('open');
        }
        else {//only one user
            globalObj.sessionType = 1;
            globalObj.loginMode = 'training';
            $.mobile.changePage( "login.html?pagemode=1" );
        }    
    }//end else not logged in
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

/*
 * This method sets up the UI when user is trying to retake a module OR
 * when redirected to take module training from test section before taking test
 * this works with the current global module id
 * Table: training_module
 */
function setUpRetake(){
    globalObj.db.transaction(function(tx){                         
                            //first, get the category the module belongs to and use that to set up the UI
                            var query = 'SELECT * FROM cthx_training_module WHERE module_id='+ globalObj.moduleID;
                            console.log('retake query: ' + query);
                            
                            tx.executeSql(query,[],
                                     function(tx,result){
                                        var row = result.rows.item(0);
                                        console.log('retake row: ' + JSON.stringify(row))
                                        //set the active category
                                        $('#cat_'+row['category_id']).addClass('active');
                                        
                                        //var expandID = 'coll_mod_'+globalObj.moduleID;
                                        
                                        //load the modules in the category as if the category was clicked
                                        loadModule(row['category_id']);
                                        
                                        //expand the right module in the list
                                        //$('#'+expandID).collapsible( "option", "collapsed", false );
                                        //console.log('collapsible element: ' + '#coll_mod_'+globalObj.moduleID);
                                    });
                    },
                    function(error){
                        console.log('Error setting up retake UI');
                    }
                
        );
}

//$(document ).delegate("#loginpage", "pageremove", function() {
//    globalObj.loginMode = '';
//});

$(document ).delegate("#loginpage", "pageinit", function() {        
        
        //sample initial string to split on - /phonegap/hcwdeploy/www/login.html?pagemode=i
        var pageMode = $('#loginpage').attr('data-url').split('?')[1].split('=')[1];
        
        if(pageMode==1){
            $('#indtab').addClass('active');
            if(globalObj.loginMode == 'test'){
                $('#context-bar').html('Accessing Tests');
                $('#login').attr('onclick','login(\'test\')');
            }
            else if(globalObj.loginMode == 'training'){
                $('#context-bar').html('Accessing Trainings');
                $('#login').attr('onclick','login(\'training\')');
            }
            else{//profile login
                $('#context-bar').html('Profile Login');
                $('#login').attr('onclick','login(\'\')');
            }
        }
        else if(pageMode==2){
            $('#context-bar').html('Select Group Members');
            $('#grouptab').addClass('active');
            getUsersList();
        }
        
});


/*
 *  This function handles individual login actions that come via the topics -> session popup route.
 *  It will always go to the training page after login. 
 */
function login(mode){
    
       var user = $('#username').val();
       var pass = $('#password').val();
       var query = "SELECT * FROM cthx_health_worker WHERE username='" + user + "' AND password='" + pass + "'";
       
       globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                             function(tx,resultSet){
                                 if(resultSet.rows.length > 0){
                                     var row = resultSet.rows.item(0);
                                     globalObj.loggedInUserID = row['worker_id'];  //register user as logged in
                                     
                                     //switch toolbar login button
                                     //$('#toolbar-login').addClass('hidden');
                                     //$('#toolbar-login').removeClass('hidden');
                                     
                                     
                                     //set common vars
                                     globalObj.sessionType = 1;
                                     globalObj.sessionUsersList = [globalObj.loggedInUserID];
                                     
                                     
                                      if(mode == 'training'){
                                         //set up array containing logged in user
                                         $.mobile.changePage( "training.html" );
                                      }
                                      else if(mode == 'test'){
                                          $.mobile.changePage( "tests.html" );
                                      }
                                     else  // go to profile page if logging in but not accessing training yest
                                         $.mobile.changePage( "profile.html" );
                                     
                                 }
                                 else{
                                     $('#loginPopup').popup('open');
                                 }
                             }
                         );
                   },
                function (error){},  //errorCB
                function (){} //successCB
        );//end transaction
            
   } 
   
   
   function getUsersList(){
       var html = '';
        globalObj.db.transaction(function(tx){
                            tx.executeSql('SELECT * FROM cthx_health_worker ORDER BY firstname',[],
                                function(tx,resultSet){
                                    //console.log('len: ' + resultSet.rows.length);
                                    if(resultSet.rows.length>0){
                                        //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                        html += '<ul id="choicelist"  data-role="listview"  >';
                                        for(var i=0; i<resultSet.rows.length; i++){
                                            var member = resultSet.rows.item(i);
                                            html += '<li class="" data-icon="false" >';
                                            html +=     '<label>';
                                            html +=        capitalizeFirstLetter(member['firstname']) + ' ' + capitalizeFirstLetter(member['middlename']) + ' ' + capitalizeFirstLetter(member['lastname']);
                                            html +=        '<input type="checkbox" name="group-checkbox" data-iconpos="right" id="'+ member['worker_id'] + '"/>';                                            
                                            html +=     '</label>';
                                            html += '</li>';
                                        }
                                        
                                        
                                        html += '<li class="noborder" data-icon="false">';
                                        html +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
                                        html +=         '<a id="login" class="pagebutton" onclick="groupLogin()" data-role="button"  data-inline="true">OK</a>'
                                        html +=     '</div>';
                                        html += '</li>';
                                        html += '</ul>';
                                        
                                        //console.log('html: ' + html);
                                        $('.focus-area').html(html);
                                        $("#loginpage").trigger('create');
                                    }
                                    //else
                                      //  $('#membersList').html(html);
                                });                       
                    },
                    function (error){}                    
            );
       
   }
   
   
 function groupLogin(){
    var checked = $('input[type="checkbox"]:checked'); var count='';
    globalObj.sessionUsersList = [];
    
    for(var i=0; i < checked.length; i++)
        globalObj.sessionUsersList.push(checked[i].id);
        
    globalObj.sessionType = 2;   //set session type
    $.mobile.changePage( "training.html" );
    
}
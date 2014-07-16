
//$(document ).delegate("#loginpage", "pageremove", function() {
//    globalObj.loginMode = '';
//});

$(document ).delegate("#loginpage", "pageinit", function() {        
        //categories query: an asynchronous call
        if(globalObj.loginMode == 'test'){
            $('#logintitle').html('Login to access tests');
            $('#login').attr('onclick','login(\'test\')');
        }
        else if(globalObj.loginMode == 'training'){
            $('#logintitle').html('Login to access trainings');
            $('#login').attr('onclick','login(\'training\')');
        }
        else
            $('#login').attr('onclick','login(\'\')');
        
        //globalObj.loginMode = '';
 });


/*
 *  This function handles individual login actions that come via the topics -> session popup route.
 *  It will always go to the training page after login. 
 */
function login(mode){
    
       var user = $('#username').val();
       var pass = $('#password').val();
       var query = "SELECT * FROM cthx_health_worker WHERE username='" + user + "' AND password='" + pass + "'";
       
       _db.transaction(function(tx){
                        tx.executeSql(query,[],
                             function(tx,resultSet){
                                 if(resultSet.rows.length > 0){
                                     var row = resultSet.rows.item(0);
                                     _loggedInUserID = row['worker_id'];  //register user as logged in
                                     
                                     //switch toolbar login button
                                     //$('#toolbar-login').addClass('hidden');
                                     //$('#toolbar-login').removeClass('hidden');
                                     
                                     
                                     //set common vars
                                     _sessionType = 1;
                                     _sessionUsersList = [_loggedInUserID];
                                     
                                     
                                      //if(_topicID > 0){   // means a topic has been selected
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
                                     navigator.notification.alert(
                                          'Wrong username or password. Try again.',  // message
                                          function(){},         // callback
                                          _appName,            // title
                                          'OK'                  // buttonName
                                      );
                                 }
                             }
                         );
                   },
                function (error){},  //errorCB
                function (){} //successCB
        );//end transaction
            
   } 
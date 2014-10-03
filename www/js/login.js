$( document ).delegate("#loginpage", "pagebeforecreate", function() {    
    globalObj.currentPage = 'loginpage';
    createHeader('loginpage','Login');
    createFooter('loginpage');
    setNotificationCounts();
});

$(document ).delegate("#loginpage", "pageshow", function() {        
    setHeaderNotificationCount('loginpage');
    
//    $('#username').on("focus", function(){
//            alert('focus funciton');
//        });
});

$(document ).delegate("#loginpage", "pageinit", function() {        
        //show the footer logged in user
        //showFooterUser();
        
        //sample initial string to split on - /phonegap/hcwdeploy/www/login.html?pagemode=1
        var pageMode = $('#loginpage').attr('data-url').split('?')[1].split('=')[1];
        //pageMode = 1;
        
        if(pageMode==1){ //individual login
            $('#indtab').addClass('active');
            if(globalObj.loginMode == 'test'){
                createLoginForm();
                $('.cbar').html('Accessing Tests');
                $('#grouptab').parent().addClass('hidden');
            }
            else if(globalObj.loginMode == 'training'){
                 createLoginForm();
                 if(globalObj.usersCount <= 1)
                    $('#grouptab').parent().addClass('hidden');
            }
            else if(globalObj.loginMode == 'admin'){
                createLoginForm();
                $('#grouptab').parent().addClass('hidden');
                $('#indtab').html('Admin Session');
                $('.c-title').html('Admin Session');
                $('.cbar').html('Admin Login');
                $('#login').attr('onclick','adminLogin()');
            }
            else{//profile login
                globalObj.loginMode = 'profile';
                createLoginForm();
                $('.cbar').html('Profile Login');
                $('#grouptab').parent().addClass('hidden');
            }
            
            $('#grouptab').attr('onclick','switchToGroupSession()');
        }
        else if(pageMode==2){ //group
            switchToGroupSession();
        }
        
});

function switchToGroupSession(){ 
    $('#grouptab').addClass('active');
    $('#indtab').removeClass('active');
    getUsersList('loginpage');
    $('.c-title').html('Group Session');
    $('#indtab').attr('onclick','switchToIndividualSession()');
    $('.cbar').html(
                     '<span id="column-width width30">Select Group Memberss</span>' +
                     '<span class="floatright textfontarial13">' +
                             '<a href="" onclick="groupLogin()" class="notextdecoration actionbutton textwhite" >Done</a>' +
                     '</span>'
                ); 
}


function switchToIndividualSession(){
    globalObj.loginMode = 'training';
    createLoginForm();
    $('#indtab').addClass('active');
    $('#grouptab').removeClass('active');
    $('#context-bar').html('Accessing Trainings');
    //$('#login').attr('onclick','login(\'training\')');
    $('#grouptab').attr('onclick','switchToGroupSession()');
}


function createLoginForm(){
    var html = '<ul data-role="listview">';
    
        html +=     '<li class="" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin" >' +
                            '<label class="" for="username">Username</label>' +
                             '<input class="iconifiedinput username" type="text" name="username" id="username" value=""  />' +
                        '</div>' +
                    '</li>';

        html +=     '<li class="noborder" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                            '<label class="" for="password">Password</label>' +
                             '<input class="iconifiedinput password" type="password" name="password" id="password" value=""  />' +
                         '</div>' +
                     '</li>';
                                
        html +=     '<li class="noborder" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                            '<a id="login" class="pagebutton" onclick="login()" data-theme="d" data-role="button"  data-inline="true">Login</a>' +
                        '</div>' +
                    '</li>';
                    
                    // forgot password
        html +=     '<li class="noborder margintop20" data-icon="false">' +
                        '<div data-role="fieldcontain" class="fieldrow nomargin">' +
                            '<a class="notextdecoration actionbutton textwhite" onclick="processForgot()" data-theme="d"  data-inline="true">Forgot Password</a>' +
                        '</div>' +
                    '</li>';
                     

       html +=  '</ul>';
       
       //if(globalObj.loginMode == 'training') $('#context-bar').html('Accessing Trainings');
       $('.focus-area').html(html);
       $('.c-title').html('Single User Session');
       $('#loginpage').trigger('create');
}


/*
 *  This function handles individual login actions that come via the topics -> session popup route.
 *  It will always go to the training page after login. 
 */
function login(){
    
       var user = $('#username').val();
       var pass = $('#password').val();
       var query = "SELECT * FROM cthx_health_worker WHERE username='" + user + "' AND password='" + pass + "'";
       
       globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                             function(tx,resultSet){
                                 if(resultSet.rows.length > 0){
                                     console.log('login length: ' + resultSet.rows.length);
                                     var row = resultSet.rows.item(0);
                                     globalObj.loggedInUserID = row['worker_id'];  //register user as logged in
                                     
                                     
                                     
                                    /*
                                    * DROP EXISTING USAGE VIEW NOW AGAINST WHEN THE LOGGED IN USER NEEDS TO 
                                    * ACCESS USAGE INFO AND ANOTHER FRESH ONE WILL BE CREATED FOR THE USER
                                    * THE dropView METHOD IS FOUND ON profile.js
                                    */
                                    globalObj.db.transaction(dropView,function(error){console.log('Error dropping view')});   
                                     
                                     
                                     //switch toolbar login button
                                     //$('#toolbar-login').addClass('hidden');
                                     //$('#toolbar-login').removeClass('hidden');
                                     
                                     
                                     //set common vars
                                     globalObj.sessionType = 1;
                                     globalObj.sessionUsersList = [globalObj.loggedInUserID];
                                     
                                     //set Notifications for user
                                     //if(globalObj.loginMode != 'profile')
                                         //setNotificationCounts();
                                      
                                      if(globalObj.loginMode == 'training'){
                                         //set up array containing logged in user
                                         $.mobile.changePage( "training.html" );
                                      }
                                      else if(globalObj.loginMode == 'test'){
                                          //ensure that user is taken to the pending tab
                                          $("body").data( "testTab" , 'pending');
                                          $.mobile.changePage( "test.html?pagemode=1" );
                                      }
                                     else  // go to profile page if logging in but not accessing training yest
                                         $.mobile.changePage( "profile.html" );
                                     
                                 }
                                 else{
                                     $('#loginPopup .popup_body p').html('Wrong username or password. Try again')
                                     $('#loginPopup').popup('open');
                                     $('#password').val('');
                                 }
                             }
                         );
                   },
                function (error){},  //errorCB
                function (){} //successCB
        );//end transaction
            
   } 
   
   
 /*
 *  This function handles admin login process
 *  It will always go to the admin page after login. 
 */
function adminLogin(){
    
       var user = $('#username').val();
       var pass = $('#password').val();
       var query = "SELECT * FROM cthx_health_worker WHERE username='" + user + "' AND password='" + pass + "'";
       
       globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                             function(tx,resultSet){
                                 if(resultSet.rows.length > 0){
                                     var row = resultSet.rows.item(0);
                                     
                                     if(adminObj.adminID == row['worker_id']){
                                        globalObj.loggedInUserID = row['worker_id'];  //register user as logged in
                                     
                                     
                                        /*
                                        * DROP EXISTING USAGE VIEW NOW AGAINST WHEN THE LOGGED IN USER NEEDS TO 
                                        * ACCESS USAGE INFO AND ANOTHER FRESH ONE WILL BE CREATED FOR THE USER
                                        * THE dropView METHOD IS FOUND ON profile.js
                                        */
                                        globalObj.db.transaction(dropView,function(error){console.log('Error dropping view')});   
                                     
                                     
                                        //set common vars
                                        globalObj.sessionType = 1;
                                        globalObj.sessionUsersList = [globalObj.loggedInUserID];
                                     
                                         $.mobile.changePage( "admin.html" );
                                     }
                                     else{
                                         $('#loginPopup .popup_body p').html('Wrong admin details. Try again')
                                         $('#loginPopup').popup('open');
                                         $('#password').val('');
                                     }
                                     
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


function getUsersList(pageid){
       var html = '';
        globalObj.db.transaction(function(tx){
                            tx.executeSql('SELECT * FROM cthx_health_worker ORDER BY firstname',[],
                                function(tx,resultSet){
                                    //console.log('len: ' + resultSet.rows.length);
                                    if(resultSet.rows.length>0){
                                        //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                        html += '<ul id="choicelist2" data-role="listview"  data-theme="none">';
                                        for(var i=0; i<resultSet.rows.length; i++){
                                            var member = resultSet.rows.item(i);
                                            html +=     '<li class="" data-icon="false">' +
                                                            '<label class="" data-role="button" for="' + member['worker_id']+ '">' + 
                                                                capitalizeFirstLetter(member['firstname']) + ' ' + capitalizeFirstLetter(member['middlename']) + ' ' + capitalizeFirstLetter(member['lastname']) +
                                                                '<input class="" type="checkbox" name="group-checkbox" id="'+ member['worker_id'] + '" data-iconpos="right" />' +
                                                            '</label>' +
                                                        '</li>';
                            
                                                //<input class="" type="radio" name="session-choice" id="individual" value="individual" data-iconpos="right" />
                                                //<label class="" data-role="button" for="individual">Individual Session</label>
                                        }
                                        
                                        
                                        //the button at end of list...transferred to the top
//                                        html += '<li class="noborder" data-icon="false">';
//                                        html +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
//                                        html +=         '<a id="grouplogin" class="pagebutton width20" style="padding: 5px 20px; display: block; " onclick="groupLogin()" data-role="button"  data-inline="true">OK</a>'
//                                        html +=     '</div>';
//                                        html += '</li>';
                                     
                                     html += '</ul>';
                                      
                                        //console.log('html: ' + html);
                                        $('.focus-area').html(html); 
                                        $("#"+pageid).trigger('create');
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
    
    if(checked.length>1){
        for(var i=0; i < checked.length; i++)
            globalObj.sessionUsersList.push(checked[i].id);

        globalObj.sessionType = 2;   //set session type
        $.mobile.changePage( "training.html" );   
    }
    else{
        $('#loginPopup .popup_body p').html('Select at least 2 group members')
        $('#loginPopup').popup('open');
    }
        
}

/*
 * Starts up the password reset process 
 */
function processForgot(){
    var username = $('#username').val();
    if(username =='' || username==null){ //no username
        $('#loginmsg').html('Please enter your user name');
        $('#loginPopup').popup('open');
    }
    else{ //user entered username
        var query = "SELECT * FROM cthx_health_worker WHERE username='" + username + "'";
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                var len = result.rows.length;
                if(len>0){//username found
                     //setup the workerObject
                     var row = result.rows.item(0);
                     workerObj.workerID = row['worker_id'];
                     workerObj.firstname = row['firstname'];
                     workerObj.middlename = row['middlename'];
                     workerObj.lastname = row['lastname'];
                     workerObj.gender = row['gender'];
                     workerObj.email = row['email'];
                     workerObj.phone = row['phone'];
                     //workerObj.qualification = row['qualification'];
                     workerObj.supervisor = row['supervisor'];
                     workerObj.cadreID = row['cadre_id'];
                     workerObj.username = row['username'];
                     workerObj.secret_question = row['secret_question'];
                     workerObj.secret_answer = row['secret_answer'];
                    
                     $.mobile.changePage('forgot.html');
                }
                else{ //username not found
                    $('#loginmsg').html('Matching user name NOT found');
                    $('#loginmsg').addClass('textcenter');
                    $('#loginPopup').popup('open');
                }
            })
        })
    }

      
}
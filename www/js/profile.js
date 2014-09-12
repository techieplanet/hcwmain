$(document).delegate("#profilepage", "pagebeforecreate", function(){        
    if(globalObj.sandboxMode==true)
        createHeader('profilepage','Profile (View as User)');
    else
        createHeader('profilepage','Profile');
    
    createFooter('profilepage');
    setNotificationCounts();
    console.log("profile pagebeforecreate");
});


$(document ).delegate("#profilepage", "pageshow", function() {        
    //alert('logged in: ' + globalObj.loggedInUserID);
    
    setHeaderNotificationCount('profilepage');
    
    //Call the notifcation calculator again so we have the count displayed
    setNotificationCounts();
                        
    //$('#total_noti').html(globalObj.totalNotificationCount);
    //$('#total_noti').html('');
    //set active sidebar element on click
    $('#sidebar_ul li a').click(function(){
        $('#sidebar_ul li a').removeClass('active');
        $(this).addClass('active');
    });
    
    
    $('#editForm').validate({
           rules:{ 
               firstname:{required:true, minlength:2}, 
               lastname:{required:true, minlength:2}, 
               email:{required:true, email:true},
               phonenumber:{required:true,digits:true, minlength:8},
               cadre:{required:true,min:1},
               //qualification:{required:true,minlength:3},
               gender:{required:true,min:1},
               squestion:{required:true,min:1},
               answer: {required:true},
               //supervisor:{required:true,min:1},
               
               username:{required:true, minlength:6}, 
               password:{required:true, minlength:6}, 
               confirm:{required:true, equalTo: "#password"}
           },
           messages:{
               firstname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               lastname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               email:{required:'Cannot be empty', email:'Enter valid email'},
               phonenumber:{required:'Cannot be empty', digits:'Enter numbers only', minlength:'8 characters minimum'},
               cadre:{required:'Cannot be empty', min:'Make a selection'},
               //qualification:{required:'Cannot be empty', minlength:'3 characters minimum'}, 
               gender:{required:'Cannot be empty', min:'Make a selection'},
               squestion:{required:'Cannot be empty', min:'Make a selection'},
               answer: {required:'Cannot be empty'},
               
               username:{required:'Cannot be empty', minlength:'6 characters minimum'}, 
               password:{required:'Cannot be empty', minlength:'6 characters minimum'}, 
               confirm:{required:'Cannot be empty', equalTo:'Password Mismatch'}
           }
        });//close validate
    
});


$(document ).delegate("#profilepage", "pageinit", function() {                
        
        var pageModeArray = $('#profilepage').attr('data-url').split('?');
        //this is the notifications mode, when the user clicks on notification on header
        if(pageModeArray.length>1){
            pageMode = pageModeArray[1].split('=')[1];
            if(pageMode=='1')
              $('div[data-role="collapsible"]').trigger("expand");
              showUsage();
        }
        else{
            //set active sidebar element on click
            $('#usagelink').addClass('active');
            showUsage();
        }
        
        //$('#total_notif').html('pi5' + globalObj.totalNotificationCount);
        
})



function dropView(tx){
//    var query = 'DROP VIEW IF EXISTS cthx_view_usage';
//    tx.executeSql(query,[],function()
//                             {
//                                console.log('View dropped');
//                            }
//                        );
}

function showUsage()  {
    globalObj.db.transaction(queryUsage,errorCB);   
}

function showPersonalInfo(){
    globalObj.db.transaction(queryInfo,errorCB);   
}

function showEdit(){
    globalObj.db.transaction(queryEdit,errorCB);   
}

function showLoginDetails(){
    globalObj.db.transaction(queryLogin,errorCB);   
}


/*
 * This method retrieves and cummulates all the test and training usage data for the logged in user
 * Tables: worker, training_session, 
 */
function queryUsage(tx){
    
//    var query = 'CREATE VIEW IF NOT EXISTS cthx_usageview AS ' +
//                'SELECT ' +
//                '(SELECT COUNT(DISTINCT training_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ') AS trainingtaken, ' +
//                '(SELECT COUNT(DISTINCT training_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND material_type=2) AS trainingguidetaken, ' +
//                '(SELECT COUNT(DISTINCT training_id) FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND status=1) AS trainingincomplete, ' +
//                '(SELECT COUNT(training_id) FROM cthx_training t WHERE t.training_id NOT IN (SELECT DISTINCT training_id from cthx_training_session s WHERE s.worker_id=' + globalObj.loggedInUserID + ')) AS trainingdue, ' +
//                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND ((score/total)*100)>40) AS testpassed, ' +
//                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND ((score/total)*100)<=40) AS testfailed, ' +
//                '(SELECT ROUND(SUM(score)/SUM(total)*100,2 ) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ') AS performance';

      //remove the required text if displayed
      if($('.required-area').length>0) $('.required-area').remove();
      
      var query = 'SELECT cthx_health_worker.*, ' +
                    '(SELECT COUNT(DISTINCT training_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ') AS trainingtaken, ' +
                    '(SELECT COUNT(DISTINCT training_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND material_type=2) AS trainingguidetaken, ' +
                    '(SELECT COUNT(DISTINCT training_id) FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND status=1) AS trainingincomplete, ' +
                    '(SELECT COUNT(training_id) FROM cthx_training t WHERE t.training_id NOT IN (SELECT DISTINCT training_id from cthx_training_session s WHERE s.worker_id=' + globalObj.loggedInUserID + ')) AS trainingdue, ' +
                    '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND ((score/total)*100)>40) AS testpassed, ' +
                    '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND ((score/total)*100)<=40) AS testfailed, ' +
                    '(SELECT ROUND(SUM(score)/SUM(total)*100,2 ) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ') AS performance ' +
                    'FROM cthx_health_worker WHERE worker_id='+ globalObj.loggedInUserID;


    //console.log('View Query: ' + query);


    //CREATE THE VIEW
    tx.executeSql(query)
    
   //now another transaction to retrieve values from fresh view created
   //query = 'SELECT * FROM cthx_usageview JOIN cthx_health_worker w WHERE worker_id='+ globalObj.loggedInUserID;
   tx.executeSql(query,[],
                        function(tx,result){
                            var len = result.rows.length;
                            //console.log('View Length: ' + len);
                            if(len>0){
                                var row = result.rows.item(0);
                                
                                var performance = row['performance']==null ? 0 : row['performance'];
                                
                                html = '<ul class="content-listing textfontarial12" data-role="listview"  >' +
                                        '<li  data-icon="false"><p>Number of training taken<span id="trainingtaken" class=ui-li-count>' + row['trainingtaken'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Number of training guides viewed<span id="trainingguide" class=ui-li-count>' + row['trainingguidetaken'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Number of uncompleted trainings taken<span id="trainingincomplete" class=ui-li-count>' + row['trainingincomplete'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Number of trainings yet to be taken<span id="trainingdue" class=ui-li-count>' + row['trainingdue'] + '</span></p></li>' +
                                        '<li data-icon="false"><p>Number of tests passed<span id="totalpassed" class=ui-li-count>' + row['testpassed'] + '</span></p></li>' +
                                        '<li data-icon="false"><p>Number of tests failed<span id="totalfailed" class=ui-li-count>' + row['testfailed'] + '</span></p></li>' +
                                        '<li data-icon="false"><p>Average Performance Percentage<span id="performance" class=ui-li-count>' + performance + '</span></p></li>'+
                                        '</ul>';
                                        
                                 $('.focus-area').html(html);
                                 $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                                 if(globalObj.sandboxMode==true){
                                     $('.c-title').append(
                                            '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                                                //'<a href="#" onclick="confirmPasswordReset()" class="pagebutton pagebuttonpadding textwhite" >Reset Password</a>' +
                                                //'&nbsp;&nbsp;' +
                                                '<a href="admin.html" class="pagebutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                            '</span>'
                                         );
                                 }
                                 
                                 $('#context-bar').html(
                                             '<span id="column-width width30">Usage Information</span>' 
                                        );
                       
                            }
                    });

}

function queryInfo(tx){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
      
    var query = 'SELECT * FROM cthx_health_worker w JOIN cthx_cadre c WHERE ' +
                'c.cadre_id=w.cadre_id AND worker_id='+ globalObj.loggedInUserID;
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);
                            
                            //names
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong class="marginbottom10">Full Name:</strong></p>' +
                                        '<p>' +
                                            '<span class="">' + capitalizeFirstLetter(row['firstname']) + '</span>' +
                                            '<span class="marginleft20">' + capitalizeFirstLetter(row['middlename']) + '</span>' +
                                            '<span class="marginleft20">' + capitalizeFirstLetter(row['lastname']) + '</span>' + 
                                        '</p>' +
                                    '</div>';
                                
                            //cadre
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Cadre:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['cadre_title'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //qualification
//                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
//                                        '<p class="marginbottom10"><strong>Qualification:</strong></p>' +
//                                        '<p>' +
//                                            '<span class="cadre">' + row['qualification'] + '</span>' +
//                                        '</p>' +
//                                    '</div>';
                                
                                
                            //phone
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Phone:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['phone'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //email
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Email:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['email'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                            
                            //gender
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Gender:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + capitalizeFirstLetter(row['gender']) + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //supervisor
                            if(row['supervisor']==1){
                                //gender
                                html += '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                                            '<p class="marginbottom10"><strong>Supervisor:</strong></p>' +
                                            '<p>' +
                                                '<span class="supervisor">Yes</span>' +
                                            '</p>' +
                                        '</div>';
                            }
                                
                            $('.focus-area').html(html);
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            if(globalObj.sandboxMode==true){
                                     $('.c-title').append(
                                            '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                                                '<a href="admin.html" class="pagebutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                            '</span>'
                                         );
                            }
                                 
                            $('#context-bar').html(
                                             '<span id="column-width width30">Personal Information</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="showEdit();" class="notextdecoration actionbutton textwhite" >Edit</a></span>'
                                        );
                        }
                        
                        
               });
}



function queryEdit(tx){
    var query = 'SELECT * FROM cthx_health_worker w JOIN cthx_cadre c WHERE ' +
                'c.cadre_id=w.cadre_id AND worker_id='+ globalObj.loggedInUserID;
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);
                            
                            //names
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong class="marginbottom10">Full Name*</strong></p>' +
                                        '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="firstname" id="firstname" value="' + capitalizeFirstLetter(row['firstname']) + '" placeholder="First Name"/></span></p>' +
                                        '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="middlename" id="middlename" value="' + capitalizeFirstLetter(row['middlename']) + '" placeholder="Middle Name" /></span> (<em>Optional</em>)</p>' +
                                        '<p><span class=""><input class="styleinputtext marginbottom10" data-role="none" size="30" type="text" name="lastname" id="lastname" value="' + capitalizeFirstLetter(row['lastname']) + '" placeholder="Last Name" /></span></p>' +
                                        '</p>' +
                                    '</div>';
                                
                            //cadre
                            html +=  '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Cadre*</strong></p>' +
                                        '<p>' +
                                            '<span class="">' +
                                                '<select name="cadre" id="cadre" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Cadre--</option>' +
                                                    '<option value="1">CHEW</option>' +
                                                    '<option value="2">Nurse</option>' +
                                                    '<option value="3">Midwife</option>' +
                                                '</select>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                            
                            
                            //qualification
//                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
//                                        '<p class="marginbottom10"><strong>Qualification:</strong></p>' +
//                                        '<p>' +
//                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="qualification" id="qualification" value="' + row['qualification'] + '" placeholder="Qualification" /></span>' +
//                                        '</p>' +
//                                    '</div>';
                                
                                
                            //phone
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Phone*</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="tel" name="phonenumber" id="phonenumber" value="' + row['phone'] + '" placeholder="Phone Number" /></span>' +
                                        '</p>' +
                                    '</div>';
                                
                                
                            //email
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Email*</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="email" name="email" id="email" value="' + row['email'] + '" placeholder="Email Address" /></span>' +
                                        '</p>' +
                                    '</div>';
                            
                            //gender
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Gender*</strong></p>' +
                                        '<p>' +
                                            '<span class="">' +
                                                '<select name="gender" id="gender" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Gender--</option>' +
                                                    '<option value="1">Male</option>' +
                                                    '<option value="2">Female</option>' +
                                                '</select>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                                
                                html +=   '<div class="textfontarial12 width95 bottomborder padcontainer margintop20 marginbottom10">' +
                                            //'<p class="marginbottom10"><strong>Secret Question</strong></p>' +
                                            '<p>' +
                                                '<span class="cadre">' +
                                                    'The secret question and its answer will be used to recover your password if you forget it.<br> ' +
                                                    'Please use an answer you can remember easily.' +
                                                '</span>' +
                                            '</p>' +
                                        '</div>';
                                
                            //secret question
                            html += '<div class="textfontarial12 width95 padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Secret Question*</strong></p>' +
                                        '<p>' +
                                            '<span class="">' +
                                                '<select name="squestion" id="squestion" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Question--</option>' +
                                                    '<option value="1">What is your favorite colour?</option>' +
                                                    '<option value="2">What city were you born?</option>' +
                                                    '<option value="2">What is your favorite food?</option>' +
                                                '</select>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';

                            //secret answer
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Secret Answer*</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="answer" id="answer" value="' + row['secret_answer'] + '" placeholder="Secret Answer" /></span>' +
                                        '</p>' +
                                    '</div>';
                            
                            $('.focus-area').html(html);
                            
                            //set combos
                            document.getElementById("cadre").selectedIndex = row['cadre_id'];
                            var genderID = row['gender']=='male' ? 1 : 2;
                            document.getElementById("gender").selectedIndex = genderID;
                            document.getElementById("squestion").selectedIndex = row['secret_question'];
                            
                            
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            if(globalObj.sandboxMode==true){
                                     $('.c-title').append(
                                            '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                                                '<a href="admin.html" class="pagebutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                            '</span>'
                                         );
                                 }
                                 
                            $('#context-bar').html(
                                             '<span id="column-width width30">Personal Information</span>' +
                                             '<span class="floatright textfontarial13">' +
                                                     '<a href="" onclick="updateUserPersonalInfo()" class="notextdecoration actionbutton textwhite" >Save</a>' +
                                             '</span>'
                                        );
                            if($('.required-area').length==0)
                                $('#context-bar').after('<div class="required-area"><strong><em>* indicates required field</em></strong></div>'); 
                             
                        }//len>0
                    }
            );
}


//updates a user profile 
 function updateUserPersonalInfo(){
     //console.log('updating session...' + rowID)
     
     var form = $('#editForm');
     form.validate();
     
     if(form.valid()){
            var gender = $('#gender').val()==1 ? 'Male' : 'Female';
            //var supervisor = $('#supervisor').val()==null ? 0 : 1;

            var fields = 'firstname,middlename,lastname,gender,email,phone,cadre_id,secret_question,secret_answer';
            var values =   $('#firstname').val() + ',' +
                           $('#middlename').val() + ',' +
                           $('#lastname').val() + ',' +
                           gender + ',' +
                           $('#email').val() +  ',' +
                           $('#phonenumber').val() + ',' +
                           //$('#qualification').val() + ',' +
                           $('#cadre').val() + ',' +
                           $('#squestion').val() + ',' +
                           $('#answer').val();
                    

            globalObj.db.transaction(function(tx){
                        DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', globalObj.loggedInUserID );

                        //queue SMS for sending 
                        queueRegSMS(tx, globalObj.loggedInUserID);

                        $('.statusmsg').html('<p>Successful</p>');
                        $('#statusPopup #okbutton').attr('onclick','profileClose()');
                        $('#statusPopup').popup('open');

                },
                function(error){
                    console.log('Error updating personal info');
                }
            );
     }
 }
 
 function profileClose(){
     $('.required-area').remove();
     $('#statusPopup').popup('close');
     showPersonalInfo();
 }
 
 function loginClose(){
     $('.required-area').remove();
     $('#statusPopup').popup('close');
     showLoginDetails();
 }
 
 function queryLogin(tx){
    var query = 'SELECT * FROM cthx_health_worker WHERE worker_id='+ globalObj.loggedInUserID;
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);
                            
                            //names
                            html += '<ul class="content-listing textfontarial12" data-role="listview">';
                            
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p ><strong>Username*</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="username" id="username" value="' + row['username'] + '" placeholder="User Name"/></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p><strong>Password*</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="password" id="password" /></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p><strong>Confirm Password*</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="confirm" id="confirm" /></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '</ul>';
                                
                           
                        }    
                            
                        $('.focus-area').html(html);
                            
                           
                            
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            if(globalObj.sandboxMode==true){
                                     $('.c-title').append(
                                            '<span class="floatright textfontarial13 width30 textright" style="margin-top:4px">' +
                                                '<a href="admin.html" class="pagebutton pagebuttonpadding textwhite" >Exit User View</a>' +
                                            '</span>'
                                         );
                            }
                                 
                            $('#context-bar').html(
                                             '<span id="column-width width30">Login Information</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="updateLoginDetails()" class="notextdecoration actionbutton textwhite" >Save</a></span>'
                                        );      
                            if($('.required-area').length==0)
                                $('#context-bar').after('<div class="required-area"><strong><em>* indicates required field</em></strong></div>'); 
                    }
            );
}
 
//updates a user login info 
 function updateLoginDetails(){
     var form = $('#editForm');
     form.validate();
     
     if(form.valid()){
        var fields = 'username,password';
        var values =   $('#username').val() + ',' +
                       $('#password').val() ;
        
        globalObj.db.transaction(function(tx){
                    DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', globalObj.loggedInUserID );
                    $('.statusmsg').html('<p>Successful</p>');
                    $('#okbutton').attr('onclick','loginClose()');
                    $('#statusPopup').popup('open');
            },
            function(error){
                console.log('Error updating personal info');
            }
        );
     }
 }

function confirmPasswordReset(){
    $('.twobuttons .statusmsg').html(
        '<p>User password  will be reset to default password</p>' +
        '<p>Do you want to proceed?</p>' 
    );
     
    $('.twobuttons .popup_header').html("Password Reset");  
    
    $('.twobuttons #cancelbutton').removeClass("hidden");
    $('.twobuttons #cancelbutton').html("No");
    $('.twobuttons #cancelbutton').attr('onclick','$(\'#twobuttonspopup\').popup(\'close\')');
    
    $('.twobuttons #okbutton').attr("onclick","resetPassword()");
    $('.twobuttons #okbutton').html("Yes");
    $('.twobuttons #okbutton').removeClass("width90");
    $('.twobuttons #okbutton').addClass("width40");   
    
    $('#twobuttonspopup').popup('open');
    //$('#profilepage').trigger('create');
}

function resetPassword(){
    globalObj.db.transaction(function(tx){
        DAO.update(tx, 'cthx_health_worker', 'password', 'mypassword', 'worker_id', globalObj.loggedInUserID);
        $('.twobuttons .statusmsg').html('<p>Password Reset Successful</p>');
        
        //multiple popusp not allowed in jqm so update the current popup for interaction
        $('.twobuttons #cancelbutton').addClass("hidden");
        $('.twobuttons #okbutton').removeClass("width40");
        $('.twobuttons #okbutton').addClass("width90");
        $('.twobuttons #okbutton').html("OK");
        $('.twobuttons #okbutton').attr("onclick","$('#twobuttonspopup').popup('close');");
        
        //$('#profilepage').trigger('create');
    });  
}


function startSandBox(){   
    var userid = 0;
    userid = $("input[name='sandbox-choice']:checked").val();
    console.log('starting sandbox: ' + userid);
    
    if(userid == null){
        $('#statusPopup .popup_body p').html('Select a User');
        $('#statusPopup #okbutton').attr("onclick","$('#statusPopup').popup('close')"); 
        $('#statusPopup').popup('open');
    }
    else if(userid > 0) {//
        switchToSandboxMode(userid);
    }
}


/*
   * this method puts the system in user sandbox mode 
   */
  function switchToSandboxMode(userid){
      //set app in sandbox mode
      globalObj.sandboxMode = true;
      console.log('SANDBOX OUTER: ' + userid);
      
      //set the new loggedInUserID 
      if(userid>0) { //existing user
          console.log('SANDBOX USER ID: ' + userid);
          globalObj.loggedInUserID = userid;
          globalObj.db.transaction(dropView);
          console.log('Swithing after view: ' + globalObj.loggedInUserID);
          $.mobile.changePage('profile.html');  
      }
      else{ //means reg just done, get last user created 
          console.log('SANDBOX USER ID2: ' + userid);
          var query = 'SELECT * FROM cthx_health_worker ORDER BY worker_id DESC LIMIT 1';
          globalObj.db.transaction(function(tx){
              tx.executeSql(query,[],function(tx,result){
                  globalObj.loggedInUserID = result.rows.item(0)['worker_id'];
                  console.log('Swithing after reg: ' + globalObj.loggedInUserID);
                  $.mobile.changePage('profile.html');  
              })
          })
      }
          
  }
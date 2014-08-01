
$(document ).delegate("#profilepage", "pageinit", function() {        
        showUsage();
        
//        $('.hasdropdown').click(function(){
//           console.log('kido');
//           $('.hasdropdown ul').slideToggle('fast');
//        });
})

function dropView(tx){
    var query = 'DROP VIEW IF EXISTS cthx_view_usage';
    tx.executeSql(query,[],function()
                             {
                                console.log('View dropped');
                            }
                        );
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
    
    var query = 'CREATE VIEW IF NOT EXISTS cthx_usageview AS ' +
                'SELECT ' +
                '(SELECT COUNT(DISTINCT training_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ') AS trainingtaken, ' +
                '(SELECT COUNT(DISTINCT training_id)  FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND material_type=2) AS trainingguidetaken, ' +
                '(SELECT COUNT(DISTINCT training_id) FROM cthx_training_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND status=1) AS trainingincomplete, ' +
                '(SELECT COUNT(training_id) FROM cthx_training t WHERE t.training_id NOT IN (SELECT DISTINCT training_id from cthx_training_session s WHERE s.worker_id=' + globalObj.loggedInUserID + ')) AS trainingdue, ' +
                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND ((score/total)*100)>40) AS testpassed, ' +
                '(SELECT COUNT(DISTINCT test_id) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ' AND ((score/total)*100)<=40) AS testfailed, ' +
                '(SELECT ROUND(SUM(score)/SUM(total)*100,2 ) FROM cthx_test_session WHERE worker_id=' + globalObj.loggedInUserID + ') AS performance';

    console.log('View Query: ' + query);


    //CREATE THE VIEW
    tx.executeSql(query)
    
   //now another transaction to retrieve values from fresh view created
   query = 'SELECT * FROM cthx_usageview JOIN cthx_health_worker w WHERE worker_id='+ globalObj.loggedInUserID;
    tx.executeSql(query,[],
                        function(tx,result){
                            var len = result.rows.length;
                            console.log('View Length: ' + len);
                            if(len>0){
                                var row = result.rows.item(0);
                                
                                var performance = row['performance']==null ? 0 : row['performance'];
                                
                                html = '<ul class="content-listing textfontarial12" data-role="listview"  >' +
                                        '<li  data-icon="false"><p>Number of training taken<span id="trainingtaken" class=ui-li-count>' + row['trainingtaken'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Number of training guides viewed<span id="trainingguide" class=ui-li-count>' + row['trainingguidetaken'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Number of uncompleted trainings taken<span id="trainingincomplete" class=ui-li-count>' + row['trainingincomplete'] + '</span></p></li>' +
                                        '<li  data-icon="false"><p>Number of training yet to be taken<span id="trainingdue" class=ui-li-count>' + row['trainingdue'] + '</span></p></li>' +
                                        '<li data-icon="false"><p>Number of tests passed<span id="totalpassed" class=ui-li-count>' + row['testpassed'] + '</span></p></li>' +
                                        '<li data-icon="false"><p>Number of tests failed<span id="totalfailed" class=ui-li-count>' + row['testfailed'] + '</span></p></li>' +
                                        '<li data-icon="false"><p>Average Performance Percentage<span id="performance" class=ui-li-count>' + performance + '</span></p></li>';
                                        '</ul>';
                                        
                                 $('.focus-area').html(html);
                                 $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                                 $('#context-bar').html(
                                             '<span id="column-width width30">Usage Information</span>' 
                                        );
                       
                            }
                    });

}

function queryInfo(tx){
    var query = 'SELECT * FROM cthx_health_worker w JOIN cthx_cadre c WHERE ' +
                'c.cadre_id=w.cadre_id AND worker_id='+ globalObj.loggedInUserID;
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0){
                            var row = result.rows.item(0);
                            
                            //names
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong class="marginbottom10">Fullname:</strong></p>' +
                                        '<p>' +
                                            '<span class="">' + capitalizeFirstLetter(row['firstname']) + '</span>' +
                                            '<span class="marginleft20">' + capitalizeFirstLetter(row['middlename']) + '</span>' +
                                            '<span class="marginleft20">' + capitalizeFirstLetter(row['lastname']) + '</span>' + 
                                        '</p>' +
                                    '</div>';
                                
                            //cadre
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Cadre:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['cadre_title'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //phone
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Phone:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['phone'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //email
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Email:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + row['email'] + '</span>' +
                                        '</p>' +
                                    '</div>';
                            
                            //gender
                            html += '<div class="textfontarial12 width90 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Gender:</strong></p>' +
                                        '<p>' +
                                            '<span class="cadre">' + capitalizeFirstLetter(row['gender']) + '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //supervisor
                            if(row['supervisor']==1){
                                //gender
                                html += '<div class="textfontarial12 width90 bottomborder padcontainer marginleft25 marginbottom10">' +
                                            '<p class="marginbottom10"><strong>Supervisor:</strong></p>' +
                                            '<p>' +
                                                '<span class="supervisor">Yes</span>' +
                                            '</p>' +
                                        '</div>';
                            }
                                
                            $('.focus-area').html(html);
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            $('#context-bar').html(
                                             '<span id="column-width width30">Personal Information</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="showEdit();" class="notextdecoration textwhite" >Edit</a></span>'
                                        )
                        }
                    }
            );
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
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong class="marginbottom10">Fullname:</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="firstname" id="firstname" value="' + capitalizeFirstLetter(row['firstname']) + '" placeholder="First Name"/></span>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="middlename" id="middlename" value="' + capitalizeFirstLetter(row['middlename']) + '" placeholder="Middle Name" /></span>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="lastname" id="lastname" value="' + capitalizeFirstLetter(row['lastname']) + '" placeholder="Last Name" /></span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //cadre
                            html +=  '<div class="textfontarial12 width95 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Cadre:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<select name="cadre" id="cadre" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Cadre--</option>' +
                                                    '<option value="1">CHEW</option>' +
                                                    '<option value="2">Nurse</option>' +
                                                    '<option value="3">Midwife</option>' +
                                                '</select>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //phone
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Phone:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="phonenumber" id="phonenumber" value="' + row['phone'] + '" placeholder="Phone Number" /></span>' +
                                        '</p>' +
                                    '</div>';
                                
                                
                            //email
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Email:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="email" id="email" value="' + row['email'] + '" placeholder="Email Address" /></span>' +
                                        '</p>' +
                                    '</div>';
                            
                            //gender
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Gender:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<select name="gender" id="gender" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select Gender--</option>' +
                                                    '<option value="1">Male</option>' +
                                                    '<option value="2">Female</option>' +
                                                '</select>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                                
                                
                             //supervisor
                            if(row['supervisor']==1){
                                html += '<div class="textfontarial12 width95 bottomborder padcontainer marginleft25 marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Supervisor:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10">' +
                                                '<select name="supervisor" id="supervisor" data-role="none" class="styleinputtext">' + 
                                                    '<option value="0">--Select--</option>' +
                                                    '<option value="1">Yes</option>' +
                                                    '<option value="2">No</option>' +
                                                '</select>' +
                                            '</span>' +
                                        '</p>' +
                                    '</div>';
                            }
                            
                            
                            
                            $('.focus-area').html(html);
                            
                            //set combos
                            document.getElementById("cadre").selectedIndex = row['cadre_id'];
                            var genderID = row['gender']=='male' ? 1 : 2;
                            document.getElementById("gender").selectedIndex = genderID;
                            if(row['supervisor']==1)
                                document.getElementById("supervisor").selectedIndex = row['supervisor'];
                            
                            
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            $('#context-bar').html(
                                             '<span id="column-width width30">Personal Information</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="updateUserPersonalInfo()" class="notextdecoration textwhite" >Save</a></span>'
                                        )      
                        }
                    }
            );
}


//updates a user profile 
 function updateUserPersonalInfo(){
     //console.log('updating session...' + rowID)
        var gender = $('#gender').val()==1 ? 'Male' : 'Female';
        var supervisor = $('#supervisor').val()==null ? 0 : 1;
        
        var fields = 'firstname,middlename,lastname,gender,email,phone,supervisor,cadre_id';
        var values =   $('#firstname').val() + ',' +
                       $('#middlename').val() + ',' +
                       $('#lastname').val() + ',' +
                       gender + ',' +
                       $('#email').val() +  ',' +
                       $('#phonenumber').val() + ',' +
                       supervisor + ',' +
                       $('#cadre').val() + ',';
        
        globalObj.db.transaction(function(tx){
                    DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', globalObj.loggedInUserID );
                    $('.statusmsg').html('<p>Successful</p>')
                    $('#okbutton').attr('onclick','profileClose()')
                    $('#statusPopup').popup('open');
                    
            },
            function(error){
                console.log('Error updating personal info');
            }
        );
 }
 
 function profileClose(){
     $('#statusPopup').popup('close');
     showPersonalInfo();
 }
 
 function loginClose(){
     $('#statusPopup').popup('close');
     showLoginDetails()();
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
                                            '<p ><strong>Username:</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="username" id="username" value="' + row['username'] + '" placeholder="User Name"/></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p><strong>Password:</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="password" id="password" /></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                                        '<div  class="margintop10">' +
                                            '<p><strong>Confirm Password:</strong></p>' +
                                            '<p class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="confirm" id="confirm" /></p>' +
                                        '</div>' +
                                    '</li>';
                                
                            html += '</ul>';
                                
                           
                        }    
                            
                        $('.focus-area').html(html);
                            
                           
                            
                            $('.c-title').html(capitalizeFirstLetter(row['firstname']) + ' ' + capitalizeFirstLetter(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']));
                            $('#context-bar').html(
                                             '<span id="column-width width30">Login Information</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="updateLoginDetails()" class="notextdecoration textwhite" >Save</a></span>'
                                        )      
                        
                    }
            );
}
 
//updates a user login info 
 function updateLoginDetails(){
        
        var fields = 'username,password';
        var values =   $('#username').val() + ',' +
                       $('#password').val() ;
        
        globalObj.db.transaction(function(tx){
                    DAO.update(tx, 'cthx_health_worker', fields, values, 'worker_id', globalObj.loggedInUserID );
                    $('.statusmsg').html('<p>Successful</p>');
                    $('#okbutton').attr('onclick','loginClose()')
                    $('#statusPopup').popup('open');
            },
            function(error){
                console.log('Error updating personal info');
            }
        );
 }

 
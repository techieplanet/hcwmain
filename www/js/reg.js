
$(document ).delegate("#regpage", "pageinit", function() {        
        globalObj.db.transaction(showPersonalReg);
})


/*
 * This sets up the user registration UI. It tries to know if the user is the first.
 * The first user gets to be the an admin.
 * If the admin leaves/changes, then he has to select the new admin from admin area
 */
var supervisorExists = false;
function showPersonalReg(tx){
    var query = 'SELECT * FROM cthx_health_worker WHERE supervisor=1';
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        var html ='';
                        if(len>0)
                            supervisorExists = true;
                            
                            //names
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong class="marginbottom10">Fullname:</strong></p>' +
                                        '<p>' +
                                            '<span class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="firstname" id="firstname" value="" placeholder="First Name"/></span>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="middlename" id="middlename" value="" placeholder="Middle Name" /></span>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="lastname" id="lastname" value="" placeholder="Last Name" /></span>' +
                                        '</p>' +
                                    '</div>';
                                
                            //cadre
                            html +=  '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
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
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Phone:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="phonenumber" id="phonenumber" value="" placeholder="Phone Number" /></span>' +
                                        '</p>' +
                                    '</div>';
                                
                                
                            //email
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
                                        '<p class="marginbottom10"><strong>Email:</strong></p>' +
                                        '<p>' +
                                            '<span class="marginleft10"><input class="styleinputtext" data-role="none" size="20" type="text" name="email" id="email" value="" placeholder="Email Address" /></span>' +
                                        '</p>' +
                                    '</div>';
                            
                            //gender
                            html += '<div class="textfontarial12 width95 bottomborder padcontainer marginbottom10">' +
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
                            
                            
                            $('.focus-area').html(html);                            
                            
                            $('.c-title').html('New User');
                            $('#c-bar').html(
                                             '<span id="column-width width30">Personal Information</span>' +
                                             '<span class="floatright textfontarial13"><a href="" onclick="setUpWorker()" class="notextdecoration textwhite" >Next</a></span>'
                                        )      
                        
                    }
            );
}

/*
 * This provides the registration log in UI
 */
function showRegLogin(){
   
                            
                //names
                html += '<ul class="content-listing textfontarial12" data-role="listview">';

                html += '<li  data-icon="false" class="bottomborder marginleft15">' +
                            '<div  class="margintop10">' +
                                '<p ><strong>Username:</strong></p>' +
                                '<p class=""><input class="styleinputtext" data-role="none" size="20" type="text" name="username" id="username" value="' + workerObj.username + '" placeholder="User Name"/></p>' +
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
                                
                           
                            
                $('.focus-area').html(html);



                    $('.c-title').html('New User');
                    $('#c-bar').html(
                                     '<span id="column-width width30">Login Information</span>' +
                                     '<span class="floatright textfontarial13"><a href="" onclick="savePersonalInfo()" class="notextdecoration textwhite" >Save</a></span>'
                                )      
                        
              
}



//set up personal information for the user. Info from the personal info tab
function setUpWorker(){
    var gender = $('#gender').val()==1 ? 'Male' : 'Female';
    var supervisor = supervisorExists==true ? 0 : 1;
        
    workerObj.firstname =  $('#firstname').val();
    workerObj.middlename = $('#middlename').val();
    workerObj.lastname = $('#lastname').val();
    workerObj.gender = gender;
    workerObj.email = $('#email').val();
    workerObj.phone = $('#phonenumber').val();
    workerObj.supervisor = supervisor;
    workerObj.cadreID = $('#cadre').val();     
    
    
    //change to the login details tab
    showRegLogin();
    console.log('worker: ' + JSON.stringify(workerObj));
    $('#login').addClass('active');
    $('#personal').removeClass('active');
}

function setUpWorkerLoginDetails(){
    workerObj.username =  $('#username').val();
    workerObj.password = $('#password').val();
}

 //saves a personal information 
 function savePersonalInfo(){  
        //set useranme and password
        setUpWorkerLoginDetails()
        
        var fields = 'firstname,middlename,lastname,gender,email,phone,supervisor,cadre_id,username,password';
        var values = '"' + workerObj.firstname + '","' +
                       workerObj.middlename + '","' +
                       workerObj.lastname + '","' +
                       workerObj.gender + '","' +
                       workerObj.email + '","' +
                       workerObj.phone + '","' +
                       workerObj.supervisor + '","' +
                       workerObj.cadreID + '","' +
                       workerObj.username + '","' +
                       workerObj.password + '"';
         
        globalObj.db.transaction(function(tx){
                    DAO.save(tx, 'cthx_health_worker', fields, values);  
                    $('.statusmsg').html('<p>Successful</p>');
                    $('#okbutton').attr('onclick','changeToProfile()')
                    $('#statusPopup').popup('open');
            },
            function(error){
                console.log('Error updating personal info');
            }
        );
  }
  
  function changeToProfile(){
      $.mobile.changePage('profile.html');
  }
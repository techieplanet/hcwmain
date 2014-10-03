$(document).delegate("#forgotpage", "pagebeforecreate", function() {        
    globalObj.currentPage = 'forgotpage';
    createHeader('forgotpage','Password Recovery');
    createFooter('forgotpage');
    setNotificationCounts();
});

$(document ).delegate("#forgotpage", "pageshow", function() {        
    
    setHeaderNotificationCount('forgotpage');
    
    $('#forgotForm').validate({
           rules:{ 
               answer: {required:true},
               password:{required:true, minlength:6}, 
               confirm:{required:true, equalTo: "#password"}
           },
           messages:{
               answer: {required:'Cannot be empty'},
               password:{required:'Cannot be empty', minlength:'6 characters minimum'}, 
               confirm:{required:'Cannot be empty', equalTo:'Password Mismatch'}
           }
        });//close validate
    
});


$(document ).delegate("#forgotpage", "pageinit", function() {                
        //show the footer logged in user
        showFooterUser();
        
        showForgotForm();    
});


function showForgotForm(){
              
      //secret question
      html =   '<div class="textfontarial12 width90 bottomborder padcontainer marginbottom10">' +
                    '<p class="marginbottom10"><strong>Secret Question</strong></p>' +
                    '<p>' +
                        '<span class="cadre">' + globalObj.secret_questions[workerObj.secret_question] + '</span>' +
                    '</p>' +
                '</div>';
            
     //answer
     html +=    '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                    '<p class="marginbottom10"><strong>Secret Answer*</strong></p>' +
                    '<p>' +
                        '<span class=""><input class="styleinputtext" data-role="none" size="30" type="text" name="answer" id="answer" value="" placeholder="Secret Answer" /></span>' +
                    '</p>' +
                '</div>';
            
     //password
     html +=    '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                    '<p class="marginbottom10"><strong>New Password*</strong></p>' +
                    '<p>' +
                        '<span class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="password" id="password" value="" placeholder="" /></span>' +
                    '</p>' +
                '</div>';
            
     //confirm
     html +=    '<div class="textfontarial12 width95 bottomborder padcontainer  marginbottom10">' +
                    '<p class="marginbottom10"><strong>Confirm New Password*</strong></p>' +
                    '<p>' +
                        '<span class=""><input class="styleinputtext" data-role="none" size="20" type="password" name="confirm" id="confirm" value="" placeholder="" /></span>' +
                    '</p>' +
                '</div>';
            
     //reset button
     html +=    '<div class="textfontarial12 width95 margintop10 padcontainer  marginbottom10" style="padding: 10px 0 20px !important;">' +     
                    '<p class="textcenter">' +
                        '<a id="reset" class="pagebutton padtwo" onclick="recoverPassword()" data-theme="d" data-role="button"  data-inline="true">Reset My Password</a>' +
                    '</p>' +
                '</div>';
                                
     $('.focus-area').html(html);
     $('.c-title').html(workerObj.firstname + ' ' + workerObj.middlename + ' ' + workerObj.lastname + '(' + workerObj.username + ')');
     if($('.required-area').length==0)
        $('.context-bar').after('<div class="required-area"><strong><em>* indicates required field</em></strong></div>'); 
}


function recoverPassword(){
    console.log('inside recoverPassword: ');
    var form = $('#forgotForm');
    form.validate();
    
    if(form.valid()){
        globalObj.db.transaction(function(tx){
            var answer = $('#answer').val();
            var password = $('#password').val();
            var query = 'SELECT secret_answer FROM cthx_health_worker WHERE worker_id=' + workerObj.workerID;
            console.log('recoverPassword: ' + query);
            tx.executeSql(query,[],function(tx,result){
                var row = result.rows.item(0);
                if(row['secret_answer'].toUpperCase()==answer.toUpperCase()){
                    DAO.update(tx, 'cthx_health_worker', 'password', password, 'worker_id', workerObj.workerID);
                    $('#forgotpage #statusPopup .statusmsg').html('<p>Password Reset Successful</p>'); 
                    $('#forgotpage #statusPopup #okbutton').attr('onclick','$.mobile.changePage("login.html?pageMode=1")');
                    $('#forgotpage #statusPopup').popup('open');
                }
                else{
                    $('#forgotpage #statusPopup .statusmsg').html('<p>Wrong answer</p>'); 
                    $('#forgotpage #statusPopup #okbutton').attr('onclick','$("#forgotpage #statusPopup").popup("close")');
                    $('#forgotpage #statusPopup').popup('open');
                }
            });
        });  
    }//end valid()
}
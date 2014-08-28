//for the homepage the createHeader & setNotificationCounts methods need to be put in
//checkForFirstTimeUse method to be sure header elements are not displayed in wizard mode
$(document).delegate("#mainpage", "pagebeforecreate", function() {   
    //console.log('pagebeforecreate 1');
    createHeader('mainpage','');
    createFooter('mainpage');
    setNotificationCounts();
        
    if(globalObj.firstTimeUse == false){
        console.log('pagebeforecreate');
        showHomeIcons();
        setUpAdminObject();
        createFooter('mainpage');
        setUpSettingsObject();
    }
});

$(document ).delegate("#mainpage", "pageshow", function() {
   setHeaderNotificationCount('mainpage'); 
   console.log('pageshow');
   //createFooter('mainpage','');
   
   //wizard form validation
   $('#wizardForm').validate({
           rules:{
               facname:{required:true, minlength:10}, 
               facid:{required:true, min:0, digits:true}, 
               line1:{required:true, minlength:15}, 
               line2:{required:true, minlength:5}, 
               shortcode:{required:true, min:0, digits:true}, 
               smscount:{required:true, min:0, digits:true}, 
               
               firstname:{required:true, minlength:2}, 
               lastname:{required:true, minlength:2}, 
               email:{required:true, email:true},
               phonenumber:{required:true,digits:true, minlength:8},
               cadre:{required:true,min:1},
               qualification:{required:true,minlength:3},
               gender:{required:true,min:1},
               squestion:{required:true,min:1},
               answer: {required:true},
               
               username:{required:true, minlength:6}, 
               password:{required:true, minlength:6}, 
               confirm:{required:true, equalTo: "#password"}
           },
           messages:{
               facname:{required:'Cannot be empty', minlength:'10 characters minimum'}, 
               facid:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0' }, 
               line1:{required:'Cannot be empty', minlength:'15 characters minimum'}, 
               line2:{required:'Cannot be empty', minlength:'5 characters minimum'}, 
               shortcode:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0'}, 
               smscount:{required:'Cannot be empty', digits: 'Numbers only', min:'Must be greater than 0'}, 
               
               firstname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               lastname:{required:'Cannot be empty', minlength:'2 characters minimum'}, 
               email:{required:'Cannot be empty', email:'Enter valid email'},
               phonenumber:{required:'Cannot be empty', digits:'Enter numbers only', minlength:'8 characters minimum'},
               cadre:{required:'Cannot be empty', min:'Make a selection'},
               qualification:{required:'Cannot be empty', minlength:'3 characters minimum'}, 
               gender:{required:'Cannot be empty', min:'Make a selection'},
               squestion:{required:'Cannot be empty', min:'Make a selection'},
               answer: {required:'Cannot be empty'},
               
               username:{required:'Cannot be empty', minlength:'6 characters minimum'}, 
               password:{required:'Cannot be empty', minlength:'6 characters minimum'}, 
               confirm:{required:'Cannot be empty', equalTo:'Password Mismatch'}
           }
        });//close validate
});


$(document ).delegate("#mainpage", "pageinit", function() {
    console.log('pageinit b4 device');
    document.addEventListener("deviceready", onDeviceReady, false);            
        function onDeviceReady(){
            //checkConnection();
            openDb();
            console.log('pageinit');
            checkForFirstTimeUse();
            
            //get and set the admin user id on start up...Very Handy in other places
            //setUpAdminObject();
            
            //document.addEventListener("offline", function(){alert("OFFline");}, false);
            //document.addEventListener("online", function(){alert("ONline");}, false);
            document.addEventListener("orientationChanged", function(){navigator.screenOrientation.set('landscape');});
            
            //log a user in 
            //logUserIn(1);
        }
        
        
       
       
       
       
            
   //put the following into deviceready event listener to disable back button totally
   //navigator.app.overrideBackbutton(true);        
//     document.addEventListener("backbutton", function(e){
//         //alert('this is the back button')
//            if($.mobile.activePage.is('#mainpage')){
//                //e.preventDefault();
//                //quits the app
//                //quitApp();
//            }
//            else if($.mobile.activePage.is('#trainingpage')){
//                //alert("Disabled while on video.");
//                //e.preventDefault();
//            }
//            else if($.mobile.activePage.is('#profilepage')){
//                if(globalObj.sandboxMode==true){
//                    //we are expectd to be on profile page. So, we can use the status pop up on profile page
//                    $('#profilepage .statusmsg').html('<p>Back button not available in <strong>Sandbox Mode</strong></p>');
//                    $('#okbutton').attr('onclick','$(\'#statusPopup\').popup(\'close\');')
//                    $('#statusPopup').popup('open');
//                }
//            }
//            
//        }, false);
        
        
        
});

function showHomeIcons(){
                
                //row 1
    var html = '<div class="home-menu height60">' +
                    '<a class="iconblock1" href="training_home.html" >' +
                            '<img src="img/training-video-icon.png" />' +
                            '<p>Training</p>' +
                    '</a>' +

                    '<a class="iconblock1" href="#" onclick="accessTests()" >' +
                        '<img src="img/test-icon.png" />' +
                            '<p>Take Test</p>' +
                     '</a>' +

                     '<a class="iconblock1" href="job_aids.html" >' +
                            '<img src="img/job-aids-icon.png" />' +
                            '<p>Job Aids </p>' +
                      '</a>' +

                      '<a class="iconblock1" href="#" onclick="accessStandingOrder("standing_order.pdf")" >' +
                            '<img src="img/standing-order-icon.png" />' +
                            '<p>Standing Order</p>' +
                       '</a>' +
                '</div>';
            
            
                //row 2
        html += '<div class="home-menu height40">' +
                    '<a class="iconblock2" href="#" onclick="accessProfile();return false;" >' +
                    '<img src="img/my-profile-icon.png" />' +
                    '<p>My Profile</p>' +
                '</a>' +

                '<a class="iconblock2" href="" onclick="accessAdminArea();">' +
                    '<img src="img/reg-icon.png" />' +
                    '<p>Registration</p>' +
                '</a>' +

                '<a class="iconblock2" href="help.html" >' +
                    '<img src="img/help-icon.png" />' +
                    '<p>Help</p>' +
                '</a>' +

                '<a class="iconblock2" href="" onclick="accessAdminArea();" >' +
                    '<img src="img/admin-icon.png" />' +
                    '<p>Facility Administration</p>' +
                '</a>' +
            '</div>';
            
        $('#mainpage #content').html(html);
}


function checkForFirstTimeUse(){
    console.log('inside checkForFirstTimeUse');
    var error = function(e){console.log('Check Error: ' + JSON.stringify(e));}
    var query = "SELECT * FROM cthx_health_worker";
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],function(tx,result){
            var len = result.rows.length;
            if(len>0){ //not first time
                console.log('not first time');
                globalObj.firstTimeUse = false;
                setUpAdminObject();
                setUpSettingsObject();
                showHomeIcons();
                setTimeout(function(){createFooter('mainpage')},500);
            }
            else{//first time use, let the show begin
                console.log('first time');
                $('.header-right').addClass('hidden');
                wizardWelcome();
            }
        });
    },error)
}


function wizardWelcome(){
    console.log('this is wizardWelcome');
    var html  = '<p class="wizardbigtext textcenter">' +
                    '<img src="img/logo128.png"><br/>' +
                    'Welcome to mTrapp Setup Wizard' +
                '</p>' +
                    '<p class="textcenter">Click <strong>Next</strong> to continue' +
                        '<br/><br/>' +
                        '<a href="" id="nextButton" onclick="showFacilitySetup()" class="notextdecoration actionbutton textwhite" >Next</a>' ;
                    '</p>' +
    $('#wizardForm').html(html);
}


function wizardClose(){
    console.log('this is wizardClose');
    var html  = '<p class="wizardbigtext textcenter">' +
                    '<img src="img/logo128.png"><br/>' +
                    'You have completed the setup process and the system is ready for use</p>' +
                    '<p class="textcenter">Click <strong>Continue</strong> to begin' +
                        '<br/><br/>' +
                        '<a href="" id="nextButton" onclick="firstLaunch()" class="notextdecoration actionbutton textwhite" >Continue</a>' ;
                    '</p>';
    $('#mainpage #content form').html(html);
}

function firstLaunch(){
    globalObj.firstTimeUse = false;
    //$.mobile.changePage('index.html');
    $('.header-right').removeClass('hidden');
    showHomeIcons();
    setUpAdminObject();
}
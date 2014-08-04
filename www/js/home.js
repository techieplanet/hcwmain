$(document).on("popupafteropen", function() {
    $('#sessionPopup').popup('reposition', 'positionTo: window');
});

/********************** Index Page   **********************/        
$(document ).delegate("#mainpage", "pageinit", function() {
  
    document.addEventListener("deviceready", onDeviceReady, false);            
    function onDeviceReady(){
        //checkConnection();
        openDb();
    }
            
   //put the following into deviceready event listener to disable back button totally
   //navigator.app.overrideBackbutton(true);        
//     document.addEventListener("backbutton", function(e){
//            if($.mobile.activePage.is('#mainpage')){
//                //e.preventDefault();
//                //quits the app
//                //quitApp();
//                
//            }
//            else if($.mobile.activePage.is('#trainingpage')){
//                //alert("Disabled while on video.");
//                //e.preventDefault();
//            }
//            
//        }, false);
});


/*
 *  this function is like a gateway for tests. it forcess the user to login IF they aren't.
 */
function accessTests(){
    globalObj.loggedInUserID = 1;
    globalObj.sessionType=1;
    globalObj.sessionUsersList = [globalObj.loggedInUserID];
    
    if(globalObj.loggedInUserID>0)
        //mode 1 opens summary, mode 2 opens certificate
        $.mobile.changePage('test.html?pagemode=1');  
    else{
        globalObj.loginMode = 'test';
        $.mobile.changePage( "login.html?pagemode=1" );
    }
}

function accessProfile(){
//    globalObj.loggedInUserID = 1;
//    globalObj.sessionType=1;
//    globalObj.sessionUsersList = [globalObj.loggedInUserID];
    
    if(globalObj.loggedInUserID>0)
        $.mobile.changePage('profile.html');  
    else{
        globalObj.loginMode = 'profile';
        $.mobile.changePage( "login.html?pagemode=1" );
    }
}


function quitApp(){
    navigator.notification.confirm(
        'Are you sure you want to quit?', // message
         function(index){if(index==2) navigator.app.exitApp();},            // callback to invoke with index of button pressed
         _appName,           // title
        ['No','Yes']     // buttonLabels
    );
}
/********************** Index Page   **********************/        
function showSpinner(){
    $.mobile.loading("show");
}

function hideSpinner(){
    $.mobile.loading("hide");
}

function logUserIn(id){
      globalObj.loggedInUserID = id;
      globalObj.sessionType=id;
      globalObj.sessionUsersList = [globalObj.loggedInUserID];
}


function accessStandingOrder(orderFileName){
    if($('#quickMenu').parent().hasClass('ui-popup-active')) {
        $('#quickMenu').popup("close");
    }
    launchPDF(globalObj.jobaidsDir, orderFileName, 'standing_order');
}


function changeMade(combo){
      var index = combo.selectedIndex;
      var hiddenField = document.querySelector('#'+combo.id + ' ~ .watcher');
      hiddenField.value = index;
      //var validator = $( "#editForm" ).validate();
      var formid = $("#"+combo.id).closest('form').attr('id');
      //alert($("#"+combo.id).closest('form').attr('id'));
      var validator = $( '#' + formid).validate();
      validator.element( "#"+hiddenField.id );
}


function focusListener(element){
        var inputID = element.id;
        
        //alert('win height: ' + $( window ).height());
                
        
        
         //alert('doc height: ' + $( document ).height());
         //alert("focused: " + element.id + ' top: ' + $('#'+inputID).offset().top);
         setTimeout(function(){
                var topPos = 0;
                var docHeight = $( document ).height();
                var inputTop = $('#'+inputID).offset().top;
                var keyPadBreakPoint = 300;
        
                if(inputTop > docHeight) {
                    topPos = (inputTop - 80);
                    $(".content-area, .content-form").animate({scrollTop: topPos }, 100);
                }
                else{
                    if((docHeight - inputTop) < 80){
                        topPos = $(".content-area, .content-form").scrollTop() + 80;
                        $(".content-area, .content-form").animate({scrollTop: topPos }, 100);
                    }
                    
                }
                
//                if(inputTop > docHeight) {
//                    topPos = inputTop - 80;
//                    $(".content-area").animate({scrollTop: topPos }, 200);
//                }
//                else{
//                    if((docHeight - inputTop) < 50){
//                       topPos = $(".content-area").scrollTop() + 50;
//                       $(".content-area").animate({scrollTop: topPos }, 100);
//                   }
//                   else{
//                       topPos = inputTop - 80;
//                       $(".content-area").animate({scrollTop: topPos }, 100);
//                   }
//                }

                //alert('toppos: ' + topPos + ' inputtop: ' + inputTop + ' keypad: ' + docHeight);
         },1000);
                     
}

/*
 *  this function is like a gateway for tests. it forcess the user to login IF they aren't.
 */
function accessTests(){
//    globalObj.loggedInUserID = 1;
//    globalObj.sessionType=1;
//    globalObj.sessionUsersList = [globalObj.loggedInUserID];
    
    if(globalObj.loggedInUserID>0){
        //mode 1 opens pending, mode 2 opens certificate
        $("body").data( "testTab" , 'pending');
        $.mobile.changePage('test.html?pagemode=1');  
    }
    else{
        globalObj.loginMode = 'test';
        $.mobile.changePage( "login.html?pagemode=1" );
    }
}

function accessProfile(){
//    globalObj.loggedInUserID = 1;
//    globalObj.sessionType=1;
//    globalObj.sessionUsersList = [globalObj.loggedInUserID];
    
    showSpinner();
    if($('#quickMenu').parent().hasClass('ui-popup-active')) {
        $('#quickMenu').popup("close");
    }
        
    if(globalObj.loggedInUserID>0){
        if(globalObj.currentPage == 'profilepage'){
            showUsage();
        }
        else
            $.mobile.changePage('profile.html');
    }
    else{
        if(globalObj.currentPage == 'loginpage'){   //clicking header profile link on login page
            globalObj.loginMode = 'profile';
            createLoginForm();
            $('#loginpage #context-bar').html('Profile Login');
            $('#loginpage #grouptab').parent().addClass('hidden');
            $('#indtab').html('Individual Session');
        }
        else{
            globalObj.loginMode = 'profile';
            $.mobile.changePage( "login.html?pagemode=1" );
        }
    }
    hideSpinner();
}


function accessNotifications(){
    if(globalObj.currentPage == 'profilepage')
            showNotificationsList();
    else
        $.mobile.changePage( "profile.html?pageMode=1" );
}


function accessHelp(){
    if(globalObj.currentPage == 'helppage'){   //clicking header help link on login page
        getHelpFiles();
    }
    else{
        $.mobile.changePage( "help.html" );
    }
        
}


function accessAdminArea(){
    if(globalObj.loggedInUserID == adminObj.adminID){
        $.mobile.changePage('admin.html');  
    }
    else{
        globalObj.loginMode = 'admin';
        $.mobile.changePage( "login.html?pagemode=1" );
    }
}

function resetGlobals(){
    globalObj.categoryID = 0;
    globalObj.moduleID = 0;
    globalObj.topicID = 0;
    globalObj.testID = 0;
    globalObj.questionID = 0;
}

function resetWorker(){
      workerObj.workerID = 0;
      workerObj.firstname = workerObj.middlename = workerObj.lastname = '';
      workerObj.gender = workerObj.phone = workerObj.email = '';
      workerObj.supervisor = workerObj.cadreID = 0;
      workerObj.username = workerObj.password = '';
      workerObj.secret_question = 0;
      workerObj.secret_answer ='';
}


function logout(){
    //console.log('inside logout');
    //$('#quickMenu').popup('close');
    //$('#logoutpopup').popup('open');
    
    if($('#quickMenu').parent().hasClass('ui-popup-active')) {
        $('#quickMenu').popup("close");
    }
    
    navigator.notification.confirm(
        'Are you sure you want to log out?', // message
         function(index){
             if(index==2)
                doLogOut();
         },            
         globalObj.appName,           // title
        ['No','Yes']     // buttonLabels
    );   
}//end logout

function doLogOut(){
    //navigator.notification.vibrate(2000);
    globalObj.loggedInUserID = -1;
    globalObj.sessionType = 0;
    globalObj.sessionUsersList = [];
    globalObj.loginMode = '';
    //globalObj.db.transaction(dropView);

    removeBodyDataValues();
    console.log('body data: ' + JSON.stringify($("body").data()));

    if(globalObj.currentPage=='mainpage'){
        //alert('logout 1');
        showFooterUser();
        //redo notification counts for home. Be sure.
        setNotificationCounts();

       //redo the context menu to get correct list,
       //set header notifications after little delay
       setTimeout(function(){
            getQuickMenuContentsForHome();
            setHeaderNotificationCount('mainpage'); 
            $('#mainpage #quickMenu').popup('close');
       },200);
       
    }
    else{
        //alert('logout 2');
        $.mobile.changePage( "index.html" );
    }
}




function removeBodyDataValues(){
        for(key in $("body").data()){
            $("body").data(key,null);
        }
}


function goBackHistory(){
    navigator.app.backHistory();
}

function quitApp(){
    if($('#quickMenu').parent().hasClass('ui-popup-active')) {
        $('#quickMenu').popup("close");
    }
    
    navigator.notification.confirm(
        'Are you sure you want to quit?', // message
         function(index){
             if(index==2) 
                 navigator.app.exitApp(); // callback to invoke with index of button pressed
         },            
         globalObj.appName,           // title
        ['No','Yes']     // buttonLabels
    );
}

function quitAppNoQuestion(){
    navigator.app.exitApp(); // callback to invoke with index of button pressed
}

function clearInputs(){
    $('input[type="text"],input[type="password"]').val("");
}

function capitalizeFirstLetter(s)
{
    var str = s.toString();
    return str.substring(0,1).toUpperCase() + str.substring(1,str.length).toLowerCase();
}

function getFirstLetter(s)
{
    var str = s.toString();
    return str.substring(0,1);
}

function getNameInitial(s){
    var str = s.toString();
    if(s.length>0)
        return str.substring(0,1).toUpperCase() + '.';
    else 
        return '';
}

function getNowDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;//January is 0!`
    var yyyy = today.getFullYear();
    
    if(dd<10){dd='0'+dd}
    if(mm<10){mm='0'+mm}
    
    var now = yyyy+'-'+mm+'-'+dd;
    return now;
}

/*
 * Select the admin user id to the global var
 */
//function setUpAdminObject(){
//    globalObj.db.transaction(function(tx){
//        var query = 'SELECT * from cthx_health_worker WHERE supervisor=1'
//        tx.executeSql(query,[],function(tx,result){
//            if(result.rows.length>0){
//                adminObj.adminID = result.rows.item(0)['worker_id'];
//            }
//        })
//    });
//}


function setUpSettingsObject(){
    var query = 'SELECT * FROM cthx_settings WHERE id=1';
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],function(tx,result){
            var row = result.rows.item(0);
            settingsObj = JSON.parse(row['jsontext']);
            console.log('setSettingsVars: ' + JSON.stringify(settingsObj));
        })
    });
}

function setUpAdminObject(){
    var query = 'SELECT * FROM cthx_health_worker WHERE supervisor=1';
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],function(tx,result){
            var row = result.rows.item(0);
            adminObj.adminID = row['worker_id'];
            adminObj.firstname = row['firstname'];
            adminObj.middlename = row['middlename'];
            adminObj.lastname = row['lastname'];
            adminObj.phone = row['phone'];
            adminObj.email = row['email'];
            //adminObj.qualification = row['qualification'];
            adminObj.username = row['username'];
            adminObj.password = row['password'];
            adminObj.gender = row['cadre'];
            adminObj.cadreID = row['cadre_id'];
            adminObj.supervisor = row['supervisor'];
            
            console.log('admin object: ' + JSON.stringify(adminObj));
        })
    });
}

function setUsersCount(){
    var query = 'SELECT COUNT(*) as userscount FROM cthx_health_worker';
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                var row = result.rows.item(0);
                globalObj.usersCount = row['userscount'];
                //console.log('setUsersCount usersCount: ' + JSON.stringify(row));
            });
        });
}

function createTwoButtonPopup(pageid){
    //remove the popup from dom if it exists
    var parent = $('#'+pageid + ' #twobuttonspopup').parent();
    var child = $('#twobuttonspopup');
    if( parent.length != 0){ 
        //then element exists, remove it
        parent.removeChild(child)
    }
    
    //create the popup
    var html='';
    html += '<div class="popup-box" data-role="popup" id="twobuttonspopup" data-overlay-theme="f" data-dismissible="false">';

    html +=     '<div class="popup_header"></div>';      //------------------- 1

    html +=         '<div class="popup_body" ><p class="statusmsg"></p></div>';  //------------------- 2

    html +=     '<div class="popup_footer">' +
                    '<a id="cancelbutton" href="#" class="pagebutton footerbutton width40" data-role="button"  data-inline="true" data-mini="true">Cancel</a>' +
                    '<a id="okbutton" href="#" class="pagebutton footerbutton width40" data-role="button" data-inline="true" data-mini="true">OK</a>' +
                '</div>';

    html += '</div>';
        
        
    //append to page
    $('#'+pageid).append(html);
    
}


function launchPDF(dirname,filename,counter_key){
    console.log('launching PDF: ' + filename);                             
    console.log('dirname: ' + dirname,'filename: ' + filename,'counter_key: ' + counter_key);
    
    window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                var rootDirectoryEntry = fileSystem.root;
                //alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = dirname + "/" + filename;
                //alert('PDF file filePath: ' + filePath);
                
                 /*
                    * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                    * Args:
                    * DirectoryEntry object: provides file look up method
                    * dirPath: path to directory to look up relative to DirectoryEntry
                 */
                rootDirectoryEntry.getFile(
                        filePath, {create: false}, 
                        function(entry){
                            //alert('help file entry.toURL: '+ entry.toURL());
                            if(!entry.isFile) return;
                            //window.open(entry.toURL(), '_blank', 'location=yes');
                            window.plugins.fileOpener.open(entry.toURL());
                            
                            //update the counts table
                            counterUpdate(counter_key);  //found on jobaids.js
                             
                        },
                        function(error){
                            //alert("No Video Found: " + JSON.stringify(error) + "\n Switching to Default Video.");
                            alert("File not found.");
                        }
                 );
                
            }, 
            function(error) {
                alert("File System Error: " + JSON.stringify(error));
            }
          );
              
}

function setHeaderNotificationCount(pageid){   
    //if logged in and there is a notification to attend to
    if(globalObj.loggedInUserID>0 && globalObj.totalNotificationCount>0){
        $('#' + pageid + ' #notification_txt_h').removeClass('hidden');
        console.log('setHeaderNotificationCount: ' + globalObj.totalNotificationCount);
        $('.noticecount').html(globalObj.totalNotificationCount);
    }
    else{
        $('#' + pageid + ' #notification_txt_h').addClass('hidden');
    }
}


function createHeader(pageid,pageheading){    
    //if(pageid=='mainpage')
       //alert('loggedin: ' + globalObj.loggedInUserID + ' admin: ' + adminObj.adminID);
    //logo
    var html =      '<div id="logo_icon_h">' +
                        '<img src="img/logo_icon.png" >'; 
                    
                    if(globalObj.currentPage != 'mainpage' && globalObj.sandboxMode==false){
                        html += '<a class="homeicon" href="index.html"><img class="floatright" src="img/home-icon.png" ></a>';
                    }
                        
        html +=     '</div>' ;

    //page title/heading
    html +=       '<div id="pageheading">' + pageheading + '</div>' ;
    
    //if(globalObj.firstTimeUse == false){
       html +=      '<div class="header-right"> ' +
           
                        //quick menu
                        '<div id="menu_icon_h">' +
                            '<a href="#quickMenu" data-rel="popup" data-position-to="origin">' +
                                '<img src="img/menu_icon.png" />' +
                            '</a>' +
                         '</div>' + 

                         //profile
                        '<div id="profile_txt_h">' +
                            '<a href="" onclick="accessProfile();return false;" class="notextdecoration textwhite textfontarialblack13">' +
                                '<span>Profile</span>' +
                            '</a>' +
                        '</div>' +
                     
                        //notification
                        '<div id="notification_txt_h" class="hidden">' +
                            '<a href="" onclick="accessNotifications(); return false;" class="notextdecoration textwhite textfontarialblack13">' +
                                '<span style="margin-right:5px;">Notifications</span>' + 
                                '<span id="total_noti" class="noticecount ui-li-count"></span>' +
                            '</a>' +
                        '</div>' +
                     
                        //help
                        '<div id="help_txt_h">' +
                            '<a href="" onclick="accessHelp();return false;" class="notextdecoration textwhite textfontarialblack13">' +
                                '<span>Help</span>' +
                            '</a>' +
                        '</div>' +
                        
                   '</div>';    //header right
            
                        
            
            
            //<!--context menu-->
            html +=     '<div data-role="popup" id="quickMenu" data-history="false">' +
                            '<ul id="choicelist" data-role="listview" >' +
                                '<li data-icon="false"><a href="index.html" id="context_mainpage">Main Menu </a></li>' +
                                '<li data-icon="false"><a href="training_home.html" id="context_traininghomepage">Training</a></li>' +
                                '<li data-icon="false"><a href="" onclick="accessTests();" id="context_testpage">Take Test</a></li>' +
                                '<li data-icon="false"><a href="job_aids.html" id="context_jobaidspage">Job Aids</a></li>' +
                                '<li data-icon="false"><a href="#" id="page" onclick="menuClose(); accessStandingOrder(\'standing_order.pdf\');">Standing Order</a></li>';

            html +=             (globalObj.loggedInUserID == adminObj.adminID) ? 
                                            '<li data-icon="false"><a href="admin.html" id="context_adminpage">Admin Area</a></li>' : '' ;

            html +=             (globalObj.loggedInUserID <= 0) ? //no logged in user
                                    '<li data-icon="false"><a href="" onclick="accessProfile();" id="context_loginpage">Log In</a></li>':
                                    '<li data-icon="false"><a href="#" onclick="menuClose(); logout();">Log Out</a></li>';

                                //<li data-icon="false"><a href="printdb.html" id="printdb">Print DB</a></li>

            html +=             '<li data-icon="false"><a href="" onclick="menuClose(); quitApp();" id="quit">Quit</a></li>' +
                             '</ul>' +
                        '</div>' ;
           //<!--context menu-->
    //}//end if first time
                              
             
           $('#' + pageid + ' .header').html(html)
           
           //hide all header links in sandbox mode
           if(globalObj.sandboxMode==true){
               //$('#' + pageid + ' .header > div > a').attr('href','#');
               $('#' + pageid + ' .header-right').addClass('hidden');
           }
             
           $("#"+globalObj.currentPage + " #quickMenu #context_" + globalObj.currentPage).addClass('active');
}

function menuClose(){
    $('#' + globalObj.currentPage + ' #quickMenu').popup("close");
}

/*
 * On the home screen the context menu and some other processes meant to run every time we enter 
 * the page do not execute. Due to JQM framework index page cycle (best guess).
 * This method come to the rescue. It is called on pageshow of the home screen and we hope it will 
 * creat a new set of links and overwrite the default. this will be done undergrouund. 
 * 
 */
function getQuickMenuContentsForHome(){
    
    var html = '<ul id="choicelist" >' +
                                '<li data-icon="false"><a href="index.html" id="context_mainpage">Main Menu </a></li>' +
                                '<li data-icon="false"><a href="training_home.html" id="context_traininghomepage">Training</a></li>' +
                                '<li data-icon="false"><a href="" onclick="accessTests();" id="context_testpage">Take Test</a></li>' +
                                '<li data-icon="false"><a href="job_aids.html" id="context_jobaidspage">Job Aids</a></li>' +
                                '<li data-icon="false"><a href="#" onclick="menuClose(); accessStandingOrder(\'standing_order.pdf\');" >Standing Order</a></li>';

        html +=             (globalObj.loggedInUserID == adminObj.adminID) ? 
                                        '<li data-icon="false"><a href="admin.html" id="context_adminpage" >Admin Area</a></li>' : '' ;

        html +=             (globalObj.loggedInUserID <= 0) ? //no logged in user
                                '<li data-icon="false"><a href="" onclick="accessProfile();" id="context_loginpage">Log In</a></li>':
                                '<li data-icon="false"><a href="#" onclick="menuClose(); logout();">Log Out</a></li>';

                            //<li data-icon="false"><a href="printdb.html" id="printdb">Print DB</a></li>

        html +=             '<li data-icon="false"><a href="" onclick="menuClose(); quitApp();" id="quit">Quit</a></li>' +
                         '</ul>';

       $('#mainpage #quickMenu').html(html);
       
       $("#mainpage #choicelist").listview();
       
       $("#mainpage #quickMenu #context_"+globalObj.currentPage).addClass('active');
}


function createFooter(pageid){
    console.log('footer: ' + pageid);
    if(adminObj.firstname.length>0 && adminObj.lastname.length>0){
        var html = '<div id="footer_text2">' +   
                        '<strong>Facility Supervisor</strong>' +
                         '<div>' + capitalizeFirstLetter(adminObj.firstname) + ' ' + getNameInitial(adminObj.middlename) + ' ' + capitalizeFirstLetter(adminObj.lastname) + '</div>' +
                         '<div>' + adminObj.phone + '</div>' +
                    '</div>' +
                    
                    '<div id="footer_text1">' +   
                        '<strong>' + settingsObj.facilityName + '</strong>' +
                        '<div>' + settingsObj.facilityAddrLine1 + '</div>' +
                        '<div>' + settingsObj.facilityAddrLine2 + '</div>' +
                    '</div>' +
                    
                    '<div id="footer_text3" class="hidden">' +
                        '<strong>Logged in as:</strong>' +
                        '<div id="loggedinusername">Demola Olaade Demola</div>' +
                    '</div>';

            $('#' + pageid + ' .footer').html(html);
    }
    else{
        $('#' + pageid + ' .footer').html("");
    }       
}


function showFooterUser(){
    //show the footer logged in user
    if(globalObj.loggedInUserID>0){
        //footer logged-in-as info
        var query = 'SELECT * FROM cthx_health_worker WHERE worker_id='+ globalObj.loggedInUserID;
        console.log('showFooterUser query: ' + query);
        globalObj.db.transaction(function(tx){
           tx.executeSql(query,[],function(tx,result){
               if(result.rows.length>0){
                    var row = result.rows.item(0);
                    var loggedInUserName = capitalizeFirstLetter(row['firstname']) + ' ' + getNameInitial(row['middlename']) + ' ' + capitalizeFirstLetter(row['lastname']);
                    //console.log('showFooterUser loggedInUserName: ' + loggedInUserName);
                    $('.footer #loggedinusername').html(loggedInUserName);
                    $('.footer #footer_text3').removeClass('hidden');
               }
           });
        });
    }
    else{
        $('.footer #footer_text3').addClass('hidden');
    }
    
}
function logUserIn(id){
      globalObj.loggedInUserID = id;
      globalObj.sessionType=id;
      globalObj.sessionUsersList = [globalObj.loggedInUserID];
}


function accessStandingOrder(orderFileName){
    launchPDF(globalObj.jobaidsDir, orderFileName, 'standing_order');
}

/*
 *  this function is like a gateway for tests. it forcess the user to login IF they aren't.
 */
function accessTests(){
//    globalObj.loggedInUserID = 1;
//    globalObj.sessionType=1;
//    globalObj.sessionUsersList = [globalObj.loggedInUserID];
    
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
    globalObj.loggedInUserID = -1;
    globalObj.sessionType = 0;
    globalObj.sessionUsersList = [];
    globalObj.loginMode = '';
    //globalObj.db.transaction(dropView);
    
    removeBodyDataValues();
    console.log('body data: ' + JSON.stringify($("body").data()));
    
    $.mobile.changePage( "index.html" );
    
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
                        '<img src="img/logo_icon.png" >' +
                        '<a href="index.html"><img class="floatright" src="img/home-icon.png" ></a>' +
                    '</div>' ;

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
                            '<a href="" onclick="accessProfile();return false;" class="notextdecoration textwhite textfontarialblack13">Profile</a>' +
                        '</div>' +
                     
                        //notification
                        '<div id="notification_txt_h" class="hidden">' +
                            '<a href="profile.html?pageMode=1" class="notextdecoration textwhite textfontarialblack13">Notifications</a>' +
                            '<span id="total_noti" class="noticecount ui-li-count"></span>' +
                        '</div>' +
                     
                        //help
                        '<div id="help_txt_h">' +
                            '<a href="help.html" class="notextdecoration textwhite textfontarialblack13">Help</a>' +
                        '</div>' +
                        
                        //'<div id="home_icon">' +
                          //  '<a href="index.html"><img src="img/home-icon.png" ></a>' +
                        //'</div>' +
                   '</div>';    //header right
            
                        
            
            
            //<!--context menu-->
            html +=     '<div data-role="popup" id="quickMenu" data-history="false">' +
                            '<ul id="choicelist" data-role="listview" >' +
                                '<li data-icon="false"><a href="index.html" id="main">Main Menu </a></li>' +
                                '<li data-icon="false"><a href="training_home.html">Training</a></li>' +
                                '<li data-icon="false"><a href="" onclick="accessTests()">Take Test</a></li>' +
                                '<li data-icon="false"><a href="job_aids.html">Job Aids</a></li>' +
                                '<li data-icon="false"><a href="#" onclick="accessStandingOrder(\'standing_order.pdf\')">Standing Order</a></li>';

            html +=             (globalObj.loggedInUserID == adminObj.adminID) ? 
                                            '<li data-icon="false"><a href="admin.html" >Admin Area</a></li>' : '' ;

            html +=             (globalObj.loggedInUserID <= 0) ? //no logged in user
                                    '<li data-icon="false"><a href="" onclick="accessProfile()">Log In</a></li>':
                                    '<li data-icon="false"><a href="#" onclick="logout()">Log Out</a></li>';

                                //<li data-icon="false"><a href="printdb.html" id="printdb">Print DB</a></li>

            html +=             '<li data-icon="false"><a href="" onclick="quitApp();" id="quit">Quit</a></li>' +
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

    if(globalObj.loggedInUserID>0){
        showFooterUser();
    }
}


function showFooterUser(){
    
    //footer logged in as area
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
$(document).delegate("#trainingpage", "pagebeforecreate", function() {    
    //set current page id in global variable
    globalObj.currentPage = 'trainingpage';
    createHeader(globalObj.currentPage,'Training');
    createFooter(globalObj.currentPage);
    setNotificationCounts();    
});

/*
 *  Displays a pop up to help background processes complete before user accesses videp
 */
$(document ).delegate("#trainingpage", "pageshow", function() {
    //console.log('trainingpage logging inside pageshow');
    //$('#vsPopup').popup('open');
    //setTimeout($('#vsPopup').popup('close'),2000);
    setHeaderNotificationCount('trainingpage');
    $('#sidebar_ul li a').click(function(){
        $('#sidebar_ul li a').removeClass('active');
        $(this).addClass('active');
    });
    
    //setHeaderNotificationCount();
    
});

/*
 *  Initializes the training page
 *  1. Fetches the video file name from database based on topic id selected
 *  2. Stores details of session into database
 *  2. Define next and previous buttons where needed
 */
 $(document ).delegate("#trainingpage", "pageinit", function() {   
     globalObj.currentPage = 'trainingpage';
     //refresh video played id list and init videoFnded & guideViewed variables
     globalObj.videoPlayedList = new Array();
     globalObj.videoEnded = false;
     globalObj.guideViewed = false;
     
//     console.log('category id: ' + globalObj.categoryID);
//     console.log('module id: ' + globalObj.moduleID);
//     console.log('topic id: ' + globalObj.topicID);
//     console.log('users list: ' + globalObj.sessionUsersList);
     
     //show the footer logged in user
     showFooterUser();
     
     globalObj.db.transaction(handleTopicFiles,
                    function(error){
                        //alert('Error loading training video')
                     }, //errorCB
                    function(){  //succesCB
                            //set next and previous id for video nav buttons
                            setNextPrevious(globalObj.topicID,globalObj.moduleID);
                        }  
            );
                
                
      /*
       *    Video event monitor: This updates the session as completed when the video ends
       */
      var video = document.getElementById('videoscreen');
      video.addEventListener('ended', function(e){
          globalObj.db.transaction(endTrainingSession,
                          function(error){console.log('check error cb: ' + JSON.stringify(error));},//errorCB}
                          function(){
                              //console.log('check success cb');
                          }
                      );
      }, false);
      
      video.addEventListener('play', function(e){
          //ensure globalObj.videoEnded mode is always false while playing video by the time you get here
          
          //start the training session, (wait for its success to remove popup)
          globalObj.db.transaction(startTrainingSession,function(){})
      }, false);
            
 });//end pageinit
 
 
 /*
 * This method fetches the video file name for the selected topic from the database
 * but get the module details along too.
 * Tables: training, module
 */
 function handleTopicFiles(tx){        
       var query = 'SELECT * FROM cthx_training t JOIN cthx_training_module m ' +
                   'WHERE m.module_id='+globalObj.moduleID + ' AND t.training_id='+globalObj.topicID;
                 
     console.log('handleTopicFiles: ' + query);
     tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    console.log('length: ' + resultSet.rows.length);
                    if(resultSet.rows.length > 0){
                        var row = resultSet.rows.item(0);
                        //console.log("training row: " + JSON.stringify(row));
                        //we are expecting one row but use this row to set global module vars to right values first
                        //might be carrying wrong value from last iteration of populateTopic method loop of traininghome.js
                        globalObj.moduleID = row['module_id']
                        globalObj.moduleTitle = row['module_title']
                        
                        console.log('after set: '+ globalObj.moduleID);
                        
                        //set the training title and popup info
                        $('#c-bar').html(row['training_title']);
                        $('.c-title #module_title, .popup_header:first-child').html(globalObj.moduleTitle);
                        console.log('remarks: ' + row['remarks']);
                        $('#moduleinfo').html(row['remarks']);
                        
                        //set the video link to set up and reload this topic when clicked
                        $('#videolink').attr('onclick','setUpVideo(' + row['training_id'] + ')')
    
                        globalObj.videoFile = row['video_file'];  //use public variable in deviceready successCB
                        globalObj.guideFile = row['guide_file'];
                        
                        attachVideoFile(); //find and add the video to the video tag                        
                    }
                },
                function(error){
                    console.log('Error in handleTopicFiles');
                }
        );
 }//end getvideo file
 
 

/*
  * This method fetches the actuall .mp4 video file from the dedicated videos directory on device
  * The video directory and video file name are already stored in public vars _videoDir and _videoFile respectively
  */
function attachVideoFile(){   
     //return;
     
       window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                rootDirectoryEntry = fileSystem.root;
                //alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = globalObj.videoDir + "/" + globalObj.videoFile;
                //alert('attachVideoFile filePath: ' + filePath);
                 /*
                    * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                    * Args:
                    * DirectoryEntry object: provides file look up method
                    * dirPath: path to directory to look up relative to DirectoryEntry
                 */
                
                rootDirectoryEntry.getFile(
                        filePath, {create: false}, 
                        function(entry){
                            //alert('videoscreen entry.toURL: '+ entry.toURL());
                            if(!entry.isFile) return;
                            
                            
                            if($('#video-box').hasClass('hidden')) $('#video-box').removeClass('hidden');
                            if(!$('#msg-box').hasClass('hidden')) $('#msg-box').addClass('hidden');
                            
                            var video = document.getElementById("videoscreen");
                            video.setAttribute('src',entry.toURL());
                        },
                        function(error){
                            //alert("No Video Found: " + JSON.stringify(error) + "\n Switching to Default Video.");
                            //alert("No Video Found: (" + filePath + ") \n Switching to Default Video.");
                            //alert("No Video Found: \n Switching to Default Video.");
                            //$('.focus-area').empty();
                            
                            if($('#msg-box').hasClass('hidden')) $('#msg-box').removeClass('hidden');
                            if(!$('#video-box').hasClass('hidden')) $('#video-box').addClass('hidden');
                            
                        }
                 );
                
            }, 
            function(error) {
                alert("File System Error: " + JSON.stringify(error));
            }
          );
              
     
 }//end trainingPageDeviceReady()
 
 
 //this method sets up the the video area and appends to the focus-area
 function setUpVideo(topicID){
        
         var html = '<div class="training-container padcontainer">' +
                            
                            '<div class="training-video-nav ui-block padcontainer floatleft" style="width:10%" >' +
                                '<a id="prevvideo" href="#" class="training-video-nav-left textfontarial13 floatleft notextdecoration textblack" >' +
                                    '<img src="img/t-v-icon-l.png" /><br/>' +
                                    'Previous' +
                                 '</a>' +
                            '</div>' +
                             
                             '<div id="video-box" class="training-video ui-block floatleft" >' +
                                '<video width="420" height="315" controls="controls" id="videoscreen">' +
                                      //<source src="refer.mp4" type="video/mp4" />
                                      //<source src="android.resource://com.tp.hcwdeploy/raw/refer" type="video/mp4"/>
                                '</video>' +
                            '</div>' +
                             
                             '<div id="msg-box" class="training-video ui-block floatleft hidden" >' +
                                    '<p>No training video found for this topic.</p>' +
                            '</div>' +
                            
                             '<div class="training-video-nav ui-block padcontainer floatleft" style="width:10%">' +
                                '<a id="nextvideo" href="#" class="training-video-nav-right textfontarial13 floatright notextdecoration textblack">' +
                                    '<img src="img/t-v-icon-r.png" /><br/>' +
                                    'Next' +
                                '</a>' +
                            '</div>' +
                      

//                            '<div class="training-video-nav ui-block padcontainer" >' + 
//                               '<a id="prevvideo" href="#" class="training-video-nav-left textfontarial13 floatleft notextdecoration textblack" >' +
//                                   'Previous' +
//                               '</a>' +
//                               '<a id="nextvideo" href="#" class="training-video-nav-right textfontarial13 floatright notextdecoration textblack">' +
//                                   'Next' +
//                               '</a>' +
//                           '</div>' +

                    '</div>';
                    
            $('.focus-area').html(html);
            $('#trainingpage').trigger('create');
            loadTraining(topicID);          
 }

  
  //saves a training session at start. Status is always 1 at start for incomplete
 //SESSION STATUS: 1- IN PROGESS/INCOMPLETE, 2- COMPLETED
 function saveTrainingSession(tx, sessionUserID){  
        var fields = '"start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id"';
        var values = '"' + getNowDate() + '",' + //start datetime
                  'NULL,' + //end datetime,
                  '"1",' + //session status - inprogress or completed
                  '"' + globalObj.sessionType + '",' +   //session type
                  '"' + globalObj.videoMaterial + '",' +  //material type constant: video -1, guide -2
                  '"' + sessionUserID + '",' +  //worker id
                  '"' + globalObj.moduleID  + '",' + //module id
                  '"' + globalObj.topicID + '"';    //training (topic) id
        
        DAO.save(tx, 'cthx_training_session', fields, values);  
        
        //queue last inserted row for SMS sending 
        //set time out 500 to wait for the update to complete
        setTimeout(function(){
            var query = 'SELECT session_id FROM cthx_training_session ORDER BY session_id DESC LIMIT 1';
            globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],function(tx,result){
                    if(result.rows.length>0){
                        var row = result.rows.item(0);
                        queueTrainingSMS(tx, row['session_id']);   
                    }
                });
            });
        },500);
        
  }
 
 
 
 //updates a training session at end of video. 
 //SESSION STATUS: 1 - INCOMPLETE, 2 - COMPLETE
 function updateTrainingSession(tx, rowID){
     //console.log('updating session...' + rowID)
          
        var fields = 'end_time,status,session_type';
        var values =  getNowDate() + ',' + //end datetime
                  '2,' + //session status - inprogress or completed
                  globalObj.sessionType;   //session type
        
        DAO.update(tx, 'cthx_training_session', fields, values, 'session_id', rowID);
        
        //queue SMS for sending 
        queueTrainingSMS(tx, rowID);
 }
 
 
 /*
  * this module is executed every time a video play event is fired. i.e. when a video starts play or is resumed
  */
 function startTrainingSession(tx){
     console.log('startTrainingSession users list: ' + globalObj.sessionUsersList);
     for(var i=0; i<globalObj.sessionUsersList.length; i++){
        console.log('outer iteration ' + i +  ': ' + globalObj.sessionUsersList[i]);
        
        //closure : this closure serves just the one user id involved per loop
        (function(i){
            setTimeout(function(){
                //this query checks whether user has a session running for that topic already
                //either at an earlier session or even in current session 
                //regardless of session type, regardless of module where the training session was started from
                  var query = "SELECT * FROM cthx_training_session s WHERE worker_id=" + globalObj.sessionUsersList[i] +
                            " AND s.training_id="+globalObj.topicID + " AND status=1"; 
                            
                  console.log('startTrainingSession query: ' + query);
                  console.log('inner iteration ' + i +  ': ' + globalObj.sessionUsersList[i]);
                  
                 console.log('update mode: ' + globalObj.videoPlaying);
                 console.log('video ended: ' + globalObj.videoEnded);
                 
                 console.log('before fetch: '+ globalObj.moduleID);
                 
                globalObj.db.transaction(function(tx){
                           tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        //globalObj.videoEnded==false part ensures that new session is only started in new video sessions
                                        //and not every time the user replays the video while not having navigated away from the VIDEO
                                        if(resultSet.rows.length==0 && globalObj.videoEnded==false){  
                                            console.log('after fetch: '+ globalObj.moduleID);
                                            console.log('before save: ' + globalObj.videoPlayedList);
                                            
                                            //To ensure that a new session is not started every time the user replays a 
                                            //previously completed video while not having navigated away from the MODULE
                                            var listLength = globalObj.videoPlayedList.length;
                                            if(globalObj.videoPlayedList.indexOf(globalObj.topicID) == -1){  
                                                    //means training id does not exist already in played video list
                                                    //so we can start a new session
                                                    //but if we are in group session we have to wait until the last loop before assigning 
                                                    //the video ha been played/started
                                                    if(i==globalObj.sessionUsersList.length-1)
                                                        globalObj.videoPlayedList[listLength] = globalObj.topicID;  //add the topic id to the list
                                                    
                                                    saveTrainingSession(tx, globalObj.sessionUsersList[i]) ; //no record for that training in this session, start session
                                                    //console.log('has saved session for: ' + globalObj.videoPlayedList);
                                            }
                                        }
                                    }   
                            );// end tx                            
                    },//end db function
                    function(error){
                        
                    }
                );//end db transaction 
                    
                    
            }, i*1000)  //end timeout
        })(i);
        
    }//end for
 }
 
 
 /*
  * this module is executed every time a video ended event is fired. i.e. when a video ends
  */
 function endTrainingSession(tx){
     for(var i=0; i<globalObj.sessionUsersList.length; i++){
        
        //closure : this closure serves just the one user id involved per loop
        (function(i){
            setTimeout(function(){
                 //same query as starting session. does same work for when video has finished playing
                 var query = "SELECT * FROM cthx_training_session s WHERE worker_id=" + globalObj.sessionUsersList[i] +
                            " AND s.training_id="+globalObj.topicID + " AND status=1"; 
                 
                 console.log('update mode: ' + globalObj.videoPlaying);
                 
                 
                globalObj.db.transaction(function(tx){
                           tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        
                                        if(resultSet.rows.length>0){
                                                var row = resultSet.rows.item(0);
                                                //we found the record , update session status
                                                updateTrainingSession(tx, row['session_id']) ; 
                                        }
                                        
                                        globalObj.videoEnded = true;
                                        
                                        //check if user has taken all trainings in module. 
                                        //If yes, direct to test attached to training module
                                        //Crucial: wait one second to execute this method. To be sure update above completes
                                        console.log('sessiontype: ' + globalObj.sessionType);
                                        if(globalObj.sessionType==1){  //since test taken only on individual sessions
                                            setTimeout(checkTestable(tx),500);   
                                        }
                                        else if(globalObj.sessionType==2){
                                            launchVideoEndPopUp();
                                        }
                                    }   
                            );// end tx
                            
                    },//end db function
                    function(error){
                        
                    }
                );//end db transaction         
                    
            }, i*1000)//end timeout
        })(i);
        
    }//end for
 }
 
 
 
 
 /*
  * This method is to set the next and previous IDs for the respective buttons
  * it selects all the trainings in a module and orders by their id to set the next and previous
  * trainings with respect to the current.
  * Tables: training, training_to_module
  */
 function setNextPrevious(topicID, moduleID){
     //console.log('inside startNextPrevious. module id: ' + moduleID + ', topic id: ' + topicID);
     globalObj.db.transaction(function(tx){
//                       var query = 'SELECT * FROM cthx_training t JOIN cthx_training_to_module tm '
//                                   'WHERE t.training_id=tm.training_id AND tm.module_id='+moduleID + ' ORDER BY training_id';
                          
                          var query = 'SELECT * FROM cthx_training_to_module tm JOIN cthx_training t JOIN cthx_training_module m ' +
                                      'WHERE t.training_id=tm.training_id AND m.module_id=tm.module_id ' + 
                                      'AND tm.module_id=' + globalObj.moduleID;
                          
                       console.log('query: ' + query);
                       tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('setNextPrevious length: ' + len);
                                if(len>0){
                                    var firstID = resultSet.rows.item(0)['training_id'];
                                    var lastID = resultSet.rows.item(len-1)['training_id'];
                                    var currentID = topicID;
                                    //console.log('firstID: ' + firstID + ', lastID: ' + lastID + ', currentID: ' + currentID);
                                    
                                    if(currentID > firstID){
                                        //console.log('inside comparison 1 currentID > firstID')
                                        $('#prevvideo').attr('onclick','loadTraining('+ (currentID-1) + ')');
                                        $('#prevvideo').removeClass('hidden');
                                    }
                                    if(currentID==firstID){
                                        $('#prevvideo').addClass('hidden');
                                    }
                                    
                                    
                                    if(currentID < lastID){
                                        //console.log('inside comparison 2 currentID < lastID')
                                        $('#nextvideo').attr('onclick','loadTraining('+ (currentID+1) + ')');
                                        $('#nextvideo').removeClass('hidden');
                                    }
                                    if(currentID==lastID){
                                        $('#nextvideo').addClass('hidden');
                                    }
                                        
                                }
                            }//end resultset function 
                        );//end tx
                },//end main db function 
                function(error){}
        );//end transaction 
 }
 

function loadTraining(topicID){
    
    //first things first, stop any currently playing video and set global videoPlaying to false
    stopVideo();
    
    $('#vsPopup').popup('open');
    console.log('loadTraining- topicID: ' + globalObj.topicID + ', update mode: ' + globalObj.videoEnded);
    globalObj.topicID = topicID;
    globalObj.db.transaction(handleTopicFiles,
                    function(error){
                        //alert('Training Nav: Error loading training video')
                    }, //errorCB
                    function(){  //succesCB
                            setNextPrevious(globalObj.topicID,globalObj.moduleID);
                            $('#vsPopup').popup('close');
                        }
            );
}


/*
 * This method tests if the logged in user has taken all the tests in the current module
 * Or at least, taken the module training guide.
 * If so, prompt user to take test
 * Tables: training_session
 */
function checkTestable(tx){

      var query = 'SELECT * FROM cthx_training_to_module ttm JOIN cthx_training t WHERE ' +
                 '(ttm.training_id = t.training_id AND ttm.module_id=' + globalObj.moduleID + ' AND ttm.module_id NOT IN ' +
                 '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE trs1.module_id=' + globalObj.moduleID + ' AND material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') ' +
                 'AND ' +
                 '(ttm.module_id=' + globalObj.moduleID + ' AND ttm.training_id NOT IN ' +
                 '(SELECT trs.training_id FROM cthx_training_session trs WHERE trs.module_id=' + globalObj.moduleID + ' AND status=2 AND worker_id=' + globalObj.loggedInUserID + ')))';
             
             
    console.log('check query: ' + query);
    
    try{
        tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        console.log('check length: ' + len);
                        if(len==0){
                                console.log('check result: go to test')
                                //the user has completed all the videos and this is the last OR
                                //user is just rewatching the video but has completed it before.
                                $('#trainingpage #testPopup #cancelbutton').attr('onclick','stayOnTraining("testPopup")'); //updates noti after closing popup
                                $('#trainingpage #testPopup #okbutton').attr('onclick','changeToTest();return false;');
                                $('#trainingpage #testPopup').popup('open');
                                
                                
                                //done all trainings, the 
                                //globalObj.justFinishedTraining = true;
                                //updateNotifications(globalObj.currentPage);
                          }
                          else{
                              //alert('check result: test deep');
                              //being here means either 
                              //1. All the video have been accessed but not all hve been completed )R
                              //2. All training videos have NOT been accessed but those trainings whose videos have not been accessed have not video registered
                              //Action: Check if any 1 of the trainings has a video registered
                              //If found, user has not completed module training.
                              var videoPending = false;
                              for(var i=0; i<len; i++){
                                  var row = result.rows.item(i);
                                  if(row['video_file'] != '')
                                      videoPending = true;
                              }
                              
                              
                              if(videoPending==true){
                                    console.log('videoPending: stay on page - ' + videoPending);
                                    $('#trainingpage #statusPopup .statusmsg').html('Finished Playing Video');
                                    $('#trainingpage #statusPopup #okbutton').attr('onclick','$("#trainingpage #statusPopup").popup("close")');
                                    $('#trainingpage #statusPopup').popup('open');
                                    
                                    //there are more videos
                                    updateNotifications(globalObj.currentPage);
                              }
                              else{
                                    console.log('videoPending: go to test');
                                    $('#trainingpage #testPopup #cancelbutton').attr('onclick','stayOnTraining("testPopup")');
                                    $('#trainingpage #testPopup #okbutton').attr('onclick','changeToTest();return false;');
                                    $('#trainingpage #testPopup').popup('open');
                              }
                          }
                    }
             );
    }
    catch(e){
        console.log(JSON.stringify(e));
    }
}


function launchVideoEndPopUp(){
    $('#trainingpage #statusPopup .statusmsg').html('Finished Playing Video');
    $('#trainingpage #statusPopup #okbutton').attr('onclick','$("#trainingpage #statusPopup").popup("close")');
    $('#trainingpage #statusPopup').popup('open');
}


function changeToTest(){
    //console.log('inside changeToTest');
    //console.log('testid: ' + globalObj.testID + ', moduleid: ' + globalObj.moduleID);
    globalObj.db.transaction(function(tx){
                     query = 'SELECT test_id FROM cthx_test WHERE module_id='+globalObj.moduleID;
                     tx.executeSql(query,[],
                            function(tx,resultSet){
                                //alert('testid: ' + globalObj.testID + ', moduleid: ' + globalObj.moduleID);
                                var len = resultSet.rows.length;
                                if(len>0){
                                    globalObj.testID = resultSet.rows.item(0)['test_id'];
                                    $.mobile.changePage('question.html');
                                }
                            }
                     );
    });
}



function stopVideo() {
    globalObj.videoEnded = false;
    var video = document.getElementById('videoscreen');
    if(video != null)
        video.pause();
}  



function launchGuide(){
    /*----------------  PC SECTION ------------------*/
//    alert('launching guide');
//    
//    //launch pop if individual sesseion 
//     if(globalObj.sessionType==1){ //inidividual session
//        setTimeout(function(){
//            $('#trainingpage #guidePopup .statusmsg').html('If you have thoroughly read the training guide then you can <br/>take the test for this module.<br/><br/>' +
//                                            'Would you like to take the test now?');
//            $('#trainingpage #guidePopup #cancelbutton').attr('onclick','stayOnTraining("guidePopup")');
//            $('#trainingpage #guidePopup #okbutton').attr('onclick','manageTrainingGuide(); return false;');
//            $('#trainingpage #guidePopup').popup('open');
//        },500);
//     }
//     return;
/*----------------  PC SECTION ------------------*/
    
    //first pause any playing video
    var video = document.getElementById('videoscreen');
    if(video != null) video.pause();
    
    try{
        window.requestFileSystem(
                LocalFileSystem.PERSISTENT, 0, 
                function(fileSystem){
                    var rootDirectoryEntry = fileSystem.root;
                    //alert('root: ' + fileSystem.root.fullPath);

                    var filePath = globalObj.guidesDir + "/" + globalObj.guideFile;
                    //alert('Guide file filePath: ' + filePath);

                     /*
                        * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                        * Args:
                        * DirectoryEntry object: provides file look up method
                        * dirPath: path to directory to look up relative to DirectoryEntry
                     */
                    rootDirectoryEntry.getFile(
                            filePath, {create: false}, 
                            function(entry){
                                //alert('guide file entry.toURL: '+ entry.toURL());
                                if(!entry.isFile) return;
                                //window.open(entry.toURL(), '_blank', 'location=yes');
                                window.plugins.fileOpener.open(entry.toURL());


                                 //launch pop if individual sesseion 
                                 if(globalObj.sessionType==1){ //inidividual session
                                    setTimeout(function(){
                                        $('#trainingpage #guidePopup #cancelbutton').attr('onclick','stayOnTraining("guidePopup")');
                                        $('#trainingpage #guidePopup #okbutton').attr('onclick','manageTrainingGuide(); return false;');
                                        $('#trainingpage #guidePopup').popup('open');
                                    },2000);
                                 }
                            },
                            function(error){
                                //alert("No Video Found: " + JSON.stringify(error) + "\n Switching to Default Video.");
                                //alert("No trainings found.");
                                $('.focus-area').empty();
                                $('.focus-area').html('<p>No trainings found.</p>');
                            }
                     );
                }, 
                function(error) {
                    alert("File System Error: " + JSON.stringify(error));
                }
              );
    } catch(e){
        console.log('Training Guide Error: ' + JSON.stringify(e));
    }
    
              
}

function manageTrainingGuide(){
    //update the session table
    //test first if viewing again in same session 
    //if(globalObj.guideViewed==false){
            globalObj.guideViewed = true;
            globalObj.db.transaction(function(tx){
                    console.log('About to save to test');
                            for(var i=0; i<globalObj.sessionUsersList.length; i++)
                                saveGuideSession(tx,globalObj.sessionUsersList[i]);
                            
                            console.log('after saving the guide session, go to test');
                            //after saving the guide session, go to test
                            changeToTest();
                            console.log('after changeToTest');
                    },
                    function(error){
                       //alert('Error saving guide session');
                    }
                );
    //}
}

function handleLeaveTraining(){
    $('#trainingpage .twobuttons .statusmsg').html('<p>Are you sure you want to leave?</p>');
    $('#trainingpage .twobuttons #cancelbutton').attr('onclick','$("#trainingpage #twobuttonspopup").popup("close")');
    $('#trainingpage .twobuttons #okbutton').attr('onclick','stopVideo(); history.go(-2)');
    $('#trainingpage #twobuttonspopup').popup('open');
}

function stayOnTraining(popupid){
    //globalObj.justFinishedTraining = false;
    updateNotifications(globalObj.currentPage); 
    $("#trainingpage #" + popupid).popup("close");
    return false;
}


//saves a training guide usage session
//
 function saveGuideSession(tx, sessionUserID){  
        var fields = '"start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id"';
        var values = '"' + getNowDate() + '",' + //start datetime
                  '"' + getNowDate() + '",' + //end datetime
                  '"2",' + //session status - inprogress or completed
                  '"' + globalObj.sessionType + '",' +   //session type
                  '"' + globalObj.guideMaterial + '",' +  //guide constant
                  '"' + sessionUserID + '",' +  //worker id
                  '"' + globalObj.moduleID  + '",' + //module id
                  '"' + globalObj.topicID + '"';    //training (topic) id
        
        DAO.save(tx, 'cthx_training_session', fields, values);      
        
        //queue last inserted row for SMS sending 
        //set time out 500 to wait for the update to complete
        setTimeout(function(){
            var query = 'SELECT session_id FROM cthx_training_session ORDER BY session_id DESC LIMIT 1';
            globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],function(tx,result){
                    if(result.rows.length>0){
                        var row = result.rows.item(0);
                        queueTrainingSMS(tx, row['session_id']);   
                    }
                });
            });
        },500);
  }
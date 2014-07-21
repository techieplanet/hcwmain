/*
 *  Displays a pop up to help background processes complete before user accesses videp
 */
$(document ).delegate("#trainingpage", "pageshow", function() {
    //console.log('trainingpage logging inside pageshow');
    //$('#vsPopup').popup('open');
    //setTimeout($('#vsPopup').popup('close'),2000);
});


/*
 *  Initializes the training page
 *  1. Fetches the video file name from database based on topic id selected
 *  2. Stores details of session into database
 *  2. Define next and previous buttons where needed
 */
 $(document ).delegate("#trainingpage", "pageinit", function() {   
     
     //refresh video played id list and ended var 
     globalObj.videoPlayedList = new Array();
     globalObj.videoEnded = false;
     
     console.log('category id: ' + globalObj.categoryID);
     console.log('module id: ' + globalObj.moduleID);
     console.log('topic id: ' + globalObj.topicID);
     console.log('users list: ' + globalObj.sessionUsersList);
     
     
     globalObj.db.transaction(handleTopicVideo,
                    function(error){alert('Error loading training video')}, //errorCB
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
 */
 function handleTopicVideo(tx){
     var query = 'SELECT * FROM cthx_training t JOIN cthx_training_module m WHERE m.module_id=t.module_id AND ' +
                 't.training_id='+globalObj.topicID;
     //console.log(query);
     tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    //console.log('length: ' + resultSet.rows.length);
                    if(resultSet.rows.length > 0){
                        var row = resultSet.rows.item(0);
                        console.log("training row: " + JSON.stringify(row));
                        //we are expecting one row but use this row to set global module vars to right values first
                        globalObj.moduleID = row['module_id']
                        globalObj.moduleTitle = row['module_title']
                        
                        
                        //set the training title and popup info
                        $('#c-bar').html(row['training_title']);
                        $('.c-title, .popup_header:first-child').html(globalObj.moduleTitle);
                        $('.info').html(capitalizeFirstLetter(row['remarks']));
                        
                        globalObj.videoFile = row['video_file'];  //use public variable in deviceready successCB
                        
                        attachVideoFile(); //find and add the video to the video tag                        
                    }
                },
                function(error){
                    console.log('Error in handleTopicVideo');
                }
        );
 }//end getvideo file
 
 

/*
  * This method fetches the actuall .mp4 video file from the dedicated videos directory on device
  * The video directory and video file name are already stored in public vars _videoDir and _videoFile respectively
  */
function attachVideoFile(){
     return;
     
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
                            var video = document.getElementById("videoscreen");
                            video.setAttribute('src',entry.toURL());
                        },
                        function(error){
                            //alert("No Video Found: " + JSON.stringify(error) + "\n Switching to Default Video.");
                            alert("No Video Found. \n Switching to Default Video.");
                        }
                 );
                
            }, 
            function(error) {
                alert("File System Error: " + JSON.stringify(error));
            }
          );
              
     
 }//end trainingPageDeviceReady()
 
 
 //saves a training session at start. Status is always 1 at start for incomplete
 //SESSION STATUS: 1- IN PROGESS/INCOMPLETE, 2- COMPLETED
 function saveTrainingSession(tx, sessionUserID){          
        var fields = '"start_time","end_time","status","session_type","worker_id","module_id","training_id"';
        var values = '"' + getNowDate() + '",' + //start datetime
                  'NULL,' + //end datetime,
                  '"1",' + //session status - inprogress or completed
                  '"' + globalObj.sessionType + '",' +   //session type
                  '"' + sessionUserID + '",' +  //worker id
                  '"' + globalObj.moduleID  + '",' + //module id
                  '"' + globalObj.topicID + '"';    //training (topic) id
        
        DAO.save(tx, 'cthx_training_session', fields, values);      
  }
 
 
 
 //updates a training session at end of video. 
 //SESSION STATUS: 1 - INCOMPLETE, 2 - COMPLETE
 function updateTrainingSession(tx, rowID){
     //console.log('updating session...' + rowID)
          
        var fields = 'end_time,status,session_type';
        var values =  getNowDate() + ',' + //end datetime
                  '2,' + //session status - inprogress or completed
                  globalObj.sessionType;   //session type
        
        DAO.update(tx, 'cthx_training_session', fields, values, 'session_id', rowID );
 }
 
 
 
 function startTrainingSession(tx){
     console.log('startTrainingSession users list: ' + globalObj.sessionUsersList);
     for(var i=0; i<globalObj.sessionUsersList.length; i++){
        console.log('outer iteration ' + i +  ': ' + globalObj.sessionUsersList[i]);
        
        //closure : this closure serves just the one user id involved per loop
        (function(i){
            setTimeout(function(){
                var query = "SELECT * FROM cthx_training_session s JOIN  cthx_training t WHERE worker_id=" + globalObj.sessionUsersList[i] +
                            " AND s.training_id="+globalObj.topicID + " AND t.training_id="+globalObj.topicID + 
                            " AND status=1"; //any session type
                  console.log('startTrainingSession query: ' + query);
                  console.log('inner iteration ' + i +  ': ' + globalObj.sessionUsersList[i]);
                  
                 console.log('update mode: ' + globalObj.videoPlaying);
                  console.log('video ended: ' + globalObj.videoEnded);
                 
                 
                globalObj.db.transaction(function(tx){
                           tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        //globalObj.videoEnded==false part ensures that new session is only started in new video sessions
                                        //and not every time the user replays the video while not having navigated away from the VIDEO
                                        if(resultSet.rows.length==0 && globalObj.videoEnded==false){  
                                            
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
 
 
 
 function endTrainingSession(tx){
     for(var i=0; i<globalObj.sessionUsersList.length; i++){
        
        //closure : this closure serves just the one user id involved per loop
        (function(i){
            setTimeout(function(){
                var query = "SELECT * FROM cthx_training_session s JOIN  cthx_training t WHERE worker_id=" + globalObj.sessionUsersList[i] +
                            " AND s.training_id="+globalObj.topicID + " AND t.training_id="+globalObj.topicID + 
                            " AND status=1"; //any session type
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
                                        if(globalObj.sessionType==1)  //since test taken only on individual sessions
                                            setTimeout(checkTestable(tx),1000);
                                        
                                            
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
 
 
 
 
 
 
 function setNextPrevious(topicID, moduleID){
     //console.log('inside startNextPrevious. module id: ' + moduleID + ', topic id: ' + topicID);
     globalObj.db.transaction(function(tx){
                       var query = 'SELECT * FROM cthx_training WHERE module_id='+moduleID + ' ORDER BY training_id';
                       console.log('query: ' + query);
                       tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('number of topics in module: ' + len);
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
    globalObj.db.transaction(handleTopicVideo,
                    function(error){alert('Training Nav: Error loading training video')}, //errorCB
                    function(){  //succesCB
                            
                            setNextPrevious(globalObj.topicID,globalObj.moduleID);
                            $('#vsPopup').popup('close');

                        }  
            );
}


function checkTestable(tx){
//    var query = 'SELECT * FROM cthx_training t LEFT JOIN cthx_training_session s ON ' +
//                't.module_id=s.module_id AND t.training_id=s.training_id ' +
//                'WHERE t.module_id=' + _moduleID + ' AND s.worker_id=' + _loggedInUserID;
    var query = 'SELECT status FROM cthx_training t LEFT JOIN cthx_training_session s ON ' + 
                't.training_id=s.training_id AND s.worker_id=' + globalObj.loggedInUserID + 
                ' WHERE t.module_id='+globalObj.moduleID;
    console.log('check query: ' + query);
    
    tx.executeSql(query,[],function(tx,resultSet){
              var len = resultSet.rows.length;
              console.log('check length: ' + len);
              if(len>0){
                  var allTaken = true;
                  for(var i=0; i<len;i++){
                      var row = resultSet.rows.item(i);
                      
                      console.log('this row: ' + JSON.stringify(row));
                      //check if the training is either not taken or its session not completed
                      if(row['status'] != 2) {
                          allTaken = false;
                          break;
                      }
                  }
                  
                  console.log('alltaken: ' + allTaken);
                  if(allTaken == true){
                      //got to test 
                      console.log('check result: go to test')
                      //if(_sessionType==1)
                          $('#testPopup').popup('open');
                  }
                  else{
                      console.log('check result: stay on page')
                      //changeToTest();
                  }
                  
              }
              else{  //len is 0. Means user has no prior training session 
                  //console.log('check result on else part: go to training')
                      //if(_sessionType==1)
                          //$('#trainingPopup').popup('open');
              }
    });
}



function changeToTest(){
    globalObj.db.transaction(function(tx){
                     query = 'SELECT test_id FROM cthx_test WHERE module_id='+globalObj.moduleID;
                     tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        var len = resultSet.rows.length;
                                        if(len>0){
                                            globalObj.testID = resultSet.rows.item(0)['test_id'];
                                            $.mobile.changePage('index.html');
                                        }
                                    }
                     );
    });
}



function stopVideo() {
    globalObj.videoEnded = false;
    var video = document.getElementById('videoscreen');
    video.pause();
}  
/*
 *  Displays a pop up to help background processes complete before user accesses videp
 */
$(document ).delegate("#trainingpage", "pageshow", function() {
    //console.log('trainingpage logging inside pageshow');
    $('#vsPopup').popup('open');
    setTimeout($('#vsPopup').popup('close'),2000);
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
     
     
     _db.transaction(handleTopicVideo,
                    function(error){alert('Error loading training video')}, //errorCB
                    function(){  //succesCB
                            //set next and previous id for video nav buttons
                            setNextPrevious(_topicID,_moduleID);
                        }  
            );
                
                
      /*
       *    Video event monitor: This updates the session as completed when the video ends
       */
      var video = document.getElementById('videoscreen');
      video.addEventListener('ended', function(e){
          _db.transaction(endTrainingSession,
                          function(error){console.log('check error cb: ' + JSON.stringify(error));},//errorCB}
                          function(){
                              //console.log('check success cb');
                          }
                      );
      }, false);
      
      video.addEventListener('play', function(e){
          //ensure upddate mode is always false while playing video
          //don't set to true: also helps preventing multiple sessions during replay
          //globalObj.videoPlaying = true;          
          //alert('called play');
          //start the training session, wait for its success to remove popup
          _db.transaction(startTrainingSession,function(){})
      }, false);
            
 });//end pageinit
 
 
 /*
 * This method fetches the video file name for the selected topic from the database
 */
 function handleTopicVideo(tx){
     
     tx.executeSql('SELECT * FROM cthx_training WHERE training_id='+_topicID,[],
                function(tx,resultSet){  //query success callback
                    if(resultSet.rows.length > 0){
                        var row = resultSet.rows.item(0);
                        //set the training title
                        $('.videotitle').html(row['training_title']);
                        _videoFile = row['video_file'];  //use public variable in deviceready successCB
                        
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
     //return;
     //alert("filepath: " + _videoDir + "/" + _videoFile)
       window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                rootDirectoryEntry = fileSystem.root;
                //alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = _videoDir + "/" + _videoFile;
                
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
                  '"' + _sessionType + '",' +   //session type
                  '"' + sessionUserID + '",' +  //worker id
                  '"' + _moduleID  + '",' + //module id
                  '"' + _topicID + '"';    //training (topic) id
        
        DAO.save(tx, 'cthx_training_session', fields, values);      
  }
 
 
 
 //updates a training session at end of video. 
 //SESSION STATUS: 1 - INCOMPLETE, 2 - COMPLETE
 function updateTrainingSession(tx, rowID){
     console.log('updating session...' + rowID)
          
        var fields = 'end_time,status,session_type';
        var values =  getNowDate() + ',' + //end datetime
                  '2,' + //session status - inprogress or completed
                  _sessionType;   //session type
        
        DAO.update(tx, 'cthx_training_session', fields, values, 'session_id', rowID );
 }
 
 
 
 function startTrainingSession(tx){
     for(var i=0; i<_sessionUsersList.length; i++){
        
        //closure : this closure serves just the one user id involved per loop
        (function(i){
            setTimeout(function(){
                var query = "SELECT * FROM cthx_training_session s JOIN  cthx_training t WHERE worker_id=" + _sessionUsersList[i] +
                            " AND s.training_id="+_topicID + " AND t.training_id="+_topicID + 
                            " AND status=1"; //any session type
                  console.log('startTrainingSession query: ' + query);
                 console.log('update mode: ' + globalObj.videoPlaying);
                  console.log('video ended: ' + globalObj.videoEnded);
                 
                 
                _db.transaction(function(tx){
                           tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        //globalObj.videoEnded==false part ensure that new session is only started in new video sessions
                                        //and not every time the user replays the video while not having navigated away from the VIDEO
                                        if(resultSet.rows.length==0 && globalObj.videoEnded==false){  
                                            
                                            console.log('before save: ' + globalObj.videoPlayedList);
                                            
                                            //To ensure that a new session is not started every time the user replays a 
                                            //previously completed video while not having navigated away from the MODULE
                                            var listLength = globalObj.videoPlayedList.length;
                                            if(globalObj.videoPlayedList.indexOf(_topicID) == -1){  
                                                    //means training id does not exist already in palyed video list
                                                    //so we can start a new session
                                                    globalObj.videoPlayedList[listLength] = _topicID;  //add the id to the list
                                                    saveTrainingSession(tx, _sessionUsersList[i]) ; //no record, save session
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
     for(var i=0; i<_sessionUsersList.length; i++){
        
        //closure : this closure serves just the one user id involved per loop
        (function(i){
            setTimeout(function(){
                var query = "SELECT * FROM cthx_training_session s JOIN  cthx_training t WHERE worker_id=" + _sessionUsersList[i] +
                            " AND s.training_id="+_topicID + " AND t.training_id="+_topicID + 
                            " AND status=1"; //any session type
                 console.log('update mode: ' + globalObj.videoPlaying);
                 
                 
                _db.transaction(function(tx){
                           tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        
                                        if(resultSet.rows.length>0){
                                                var row = resultSet.rows.item(0);
                                                updateTrainingSession(tx, row['session_id']) ; //no record, save session   
                                        }
                                        
                                        globalObj.videoEnded = true;
                                        
                                        //check if user has taken all trainings in module. 
                                        //If yes, direct to test attached to training module
                                        //Crucial: wait one second to execute this method. To be sure update above completes
                                        console.log('sessiontype: ' + _sessionType);
                                        if(_sessionType==1)  //test taken only on individual sessions
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
     _db.transaction(function(tx){
                       var query = 'SELECT * FROM cthx_training WHERE module_id='+moduleID + ' ORDER BY training_id';
                       //console.log('query: ' + query);
                       tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                //console.log('number of topics in module: ' + len);
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
    console.log('loadTraining- topicID: ' + _topicID + ', update mode: ' + globalObj.videoPlaying);
    _topicID = topicID;
    _db.transaction(handleTopicVideo,
                    function(error){alert('nextTraining: Error loading training video')}, //errorCB
                    function(){  //succesCB
                            
                            setNextPrevious(_topicID,_moduleID);
                            $('#vsPopup').popup('close');
                            
//                          //start the training session, wait for its success to remove popup
                            console.log('nextTraining: sucess for startTrainingSession');
//                            _db.transaction(startTrainingSession,
//                                              function(error){alert("Error Starting Session")},
//                                              function(){
//                                                    //set next and previous id for buttons
//                                                    setNextPrevious(_topicID,_moduleID);
//                                                    $('#vsPopup').popup('close');
//                                              }
//                                         );
                        }  
            );
}


function checkTestable(tx){
//    var query = 'SELECT * FROM cthx_training t LEFT JOIN cthx_training_session s ON ' +
//                't.module_id=s.module_id AND t.training_id=s.training_id ' +
//                'WHERE t.module_id=' + _moduleID + ' AND s.worker_id=' + _loggedInUserID;
    var query = 'SELECT status FROM cthx_training t LEFT JOIN cthx_training_session s ON ' + 
                't.training_id=s.training_id AND s.worker_id=' + _loggedInUserID + 
                ' WHERE t.module_id='+_moduleID
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

//var incompleteSessionFound=false;
//function checkTestable(tx){
////    var query = 'SELECT * FROM cthx_training t LEFT JOIN cthx_training_session s ON ' +
////                't.module_id=s.module_id AND t.training_id=s.training_id ' +
////                'WHERE t.module_id=' + _moduleID + ' AND s.worker_id=' + _loggedInUserID;
//
//    var query = 'SELECT * FROM cthx_training WHERE module_id='+ _moduleID;
//    console.log('check query: ' + query);
//    
//    tx.executeSql(query,[],function(tx,resultSet){
//              var len = resultSet.rows.length;
//              if(len>0){
//                  for(var i=0; i<len;i++){
//                      (function(i){
//                          setTimeout(function(){
//                                var row = resultSet.rows.item(i);
//                                //training_id = row['training_id'];
//                                
//                                checkSessionExists(row['training_id']);  //this will set the incompleteSessionFound var                                
//                                
//                                
//                                console.log('incompleteSessionFound: ' + incompleteSessionFound);
//                                if(incompleteSessionFound==true){
//                                    //console.log('this row: ' + JSON.stringify(row));
//                                   //check if the training is either not taken or its session not completed
//                                   console.log('check result: stay on page for next training')
//                                }
//                                else{  // no incompleteSessionFound
//                                      console.log('check result: go to test')
//                                      $('#testPopup').popup('open');
//                                }
//                          },i*2000);
//                      })(i);
//                  }
//              }
//    });
//}


//function checkSessionExists(training_id){
//    //no need to chek others. One incomplete/absent session is enough to keep user on training page
//    if(incompleteSessionFound == true)
//        return;  
//    
//    var query = 'SELECT DISTINCT status FROM cthx_training_session WHERE training_id='+training_id + ' AND worker_id=' + _loggedInUserID;
//    _db.transaction(function(tx){
//                tx.executeSql(query,[],
//                                function(tx,resultSet){
//                                    len = resultSet.rows.length;
//                                    if(len>0){
//                                        for(var i=0; i<len; i++){
//                                            var row = resultSet.rows.item(i);
//                                            if(row['status']==1){
//                                                incompleteSessionFound = true;
//                                                break;
//                                            }
//                                        }
//                                    }
//                                    else{   //user hasnt even started session for this training
//                                        incompleteSessionFound = true;
//                                    }
//                                    console.log('done with checkSessionExists: ' + training_id);
//                                }
//                    );
//                },
//                function (error){console.log('Error setting incompleteSessionFound');}
//            );//end of db transaction 
//}



function changeToTest(){
    _db.transaction(function(tx){
                     query = 'SELECT test_id FROM cthx_test WHERE module_id='+_moduleID;
                     tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        var len = resultSet.rows.length;
                                        if(len>0){
                                            _testID = resultSet.rows.item(0)['test_id'];
                                            $.mobile.changePage('question.html');
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
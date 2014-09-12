//var buttonGroup='';
function setNotificationCounts(){
    //console.log('Compute notifications...');
    globalObj.totalNotificationCount = 0;
    
    if(globalObj.loggedInUserID>0){
        getUncompletedTrainings(true);
        getWaitingTests(true);
        getFailedTests(true);
    }
    
    console.log('Uncompleted Trainings: ' + globalObj.uncompletedTrainings + ' Waiting Tests: ' + globalObj.waitingTests + ' Faiiled Tests: ' + globalObj.failedTests);
}


 
 /*
  * The method gets all trainings mapped to the modules the user has started
  * and points out all trainings (topics) in those modules the user has not done or has not completeed
  * Tables: training_tom_module, training_module, training_session, traininig session
  */
 function getUncompletedTrainings(countMode){
     //remove the required text if displayed
     if($('.required-area').length>0) $('.required-area').remove();
      
    console.log('Uncompleted Trainings: ' + globalObj.uncompletedTrainings + ' Waiting Tests: ' + globalObj.waitingTests + ' Faiiled Tests: ' + globalObj.failedTests);
    var query = 'SELECT ttm.module_id,ttm.training_id,module_title,training_title FROM cthx_training_to_module ttm JOIN cthx_training_module trm JOIN cthx_training t ON ' +
                'ttm.module_id=trm.module_id AND ttm.training_id=t.training_id WHERE trm.module_id IN ' +       //helps get full details of modules and trainings in set
                '(SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') AND ' +   //all modules the user has taken training in goes into the set
                'trm.module_id NOT IN ' +
                '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') AND ' +  //exclude modules whicj the user has has viewed their guide from set
                'ttm.training_id NOT IN ' +
                '(SELECT trs2.training_id FROM cthx_training_session trs2 WHERE status=2 AND trs2.worker_id=' + globalObj.loggedInUserID + ') ';     //exclude video topics which the user has completed from set
                'ORDER BY start_time';

    //console.log('Notifications: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    
                                    //set counts
                                    globalObj.uncompletedTrainings = len;
                                    $('#uncompleted').html(globalObj.uncompletedTrainings);
                                    globalObj.totalNotificationCount += parseInt(len); //cummulate total count
                                    //console.log('unc: ' + globalObj.totalNotificationCount)
                                    if(countMode == true) return; //return count if count mode
                                    
                                    var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                                    //var html = '<div class="row-content textfontarial12 ">' ;
                                    if(len>0){
                                        for(var i=0; i<len; i++){
                                            var row = result.rows.item(i);
                                                html += '<li  data-icon="false" class="bottomborder floatleft">' +
                                                            '<div class="width60 floatleft">' +
                                                                '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                                                '<p class="width70">Topic: ' + row['training_title'] + '</p>' +
                                                            '</div>' +
                                                            '<div class="width30 floatright margintop15">' +
                                                                '<a  class="pagebutton " onclick="c2TrainingFromNoti(' + row['training_id'] + ',' + row['module_id'] + '); return false;" style="padding:6% 8%;" data-theme="d" data-role="button"  data-inline="true" >Go to Training</a>' +
                                                            '</div>' +
                                                        '</li>';
                                        }
                                        //html += '</div>';
                                        html += '</ul>';
                                        
                                        $('.focus-area').html(html);
                                        $('#context-bar').html('Notifications');
                                    }
                                    else{                                                    
                                        $('.focus-area').html(      
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No uncompleted trainings found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                        $('#context-bar').html('Notifications');
                                    }

                                }
                            );
                    });
 }
 
 /*
  * This gets all modules which the user has taken and completed trainings for 
  * but the user has not taken the module assessment/test 
  */
function getWaitingTests(countMode){
    //remove the required text if displayed
    if($('.required-area').length>0) $('.required-area').remove();
      
     console.log('inside getWaitingTests: ');
       //Part 1(before first AND) - gets list of modules touched at all by user
       //Part 2(before second AND) - selects/picks out each module_id found in list of modules completed either by videos or guide
       //Part 3(after second AND) - selects/picks out each module_id NOT found in list of modules tests taken by user
       //AND operation on the 3 parts produces 'TRAININGS COMPLETED BUT TEST NOT DONE'.
       var query = 'SELECT DISTINCT(trm.module_id),module_title,test_id FROM ' +
                   'cthx_training_module trm JOIN cthx_test t ON trm.module_id=t.module_id ' +
                   'WHERE trm.module_id IN (SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') ' +
                   
                   'AND ' +
                   '(trm.module_id IN ' +
                   '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') OR ' +
                   'trm.module_id NOT IN ' +
                   '(SELECT ttm1.module_id FROM cthx_training tr JOIN cthx_training_to_module ttm1 ON tr.training_id=ttm1.training_id AND ttm1.module_id=trm.module_id ' +
                   'LEFT JOIN cthx_training_session trs2 ON  tr.training_id=trs2.training_id AND trs2.worker_id=' + globalObj.loggedInUserID + ' WHERE (trs2.status=1 OR trs2.status IS NULL))) ' +
                    
                   'AND ' +
                   'trm.module_id NOT IN ' +
                   '(SELECT DISTINCT(t2.module_id) FROM cthx_test_session tes JOIN cthx_test t2 ON t2.test_id=tes.test_id WHERE tes.worker_id=' + globalObj.loggedInUserID + ')';
    

    //console.log('Notifications getWaitingTests: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    
                                    //set counts
                                    globalObj.waitingTests = len;
                                    $('#waiting').html(globalObj.waitingTests);
                                    globalObj.totalNotificationCount += parseInt(len); //cummulate total count
                                    //console.log('waiting: ' + globalObj.totalNotificationCount)
                                    //return count if count mode
                                    if(countMode == true) return;
                                    //console.log('length waiting: ' + len);
                                    if(len>0){
                                          var html = '<div class="row-content textfontarial12 ">' ;
                                            for (var i=0; i<len; i++){
                                                 var row = result.rows.item(i);

                                                 html += '<div>' +
                                                            '<p>' +
                                                                '<span class="row-content-col width60 textleft">' + row['module_title'] + '</span>' +
                                                                '<span id="row-content-col" class="width10">&nbsp;</span>' +
                                                                '<span class="row-content-col-btn width30">' +
                                                                    '<a href="" class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + '); return false;" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Take test now</a>' +
                                                                '</span>' +
                                                            '</p>' +
                                                         '</div>';

                                             }
                                             html += '</div>';
                                        
                                        
                                        $('.focus-area').html(html);
                                        $('#context-bar').html('Notifications');
                                    }
                                    else{
                                        //console.log('else for waiting: ');
                                        $('.focus-area').html(  
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No waiting tests for completed module trainings found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                        $('#context-bar').html('Notifications');
                                    }

                                }
                            );
                    });
 }
 
 
 /*
  * This gets all the tests the user has done and failed.
  * It however takes into cognizance the latest test taken for the module.
  * If the user has failed the test before and passed later then he has passed the test
  * If the user has passed the test before then takes it again and fails then he has failed the test
  * I.E. The lastest test session for each module is what matters.
  */
 function getFailedTests(countMode){
     //remove the required text if displayed
      if($('.required-area').length>0) $('.required-area').remove();
      
//     var query = 'SELECT * FROM cthx_test_session tes JOIN cthx_test t ON ' +
//                 'tes.test_id=t.test_id WHERE ' +
//                 'session_id = (SELECT MAX(tes1.session_id) FROM cthx_test_session tes1 WHERE tes1.test_id=t.test_id AND ((tes1.score/tes1.total)*100)<40 ) AND ' +
//                 'worker_id=1';

       //Part 1(before first AND) - gets list of test sessions user has done along with their module and test information
       //Part 2(before second AND) - selects/picks out the last session of each (or currently considered) test taken by the user 
       //Part 3(after second AND) - selects/picks out occurences of the test where the user has failed it
       //AND operation on the 3 parts produces 'FAILED TEST IFF THE LAST SESSION WAS FAILED'.
       var query = 'SELECT * FROM cthx_test_session tes JOIN cthx_training_module trm JOIN cthx_test t ' +
                   'ON tes.test_id=t.test_id AND t.module_id=trm.module_id ' +
                   
                   'AND ' +
                   'tes.session_id IN ' +
                   '(SELECT MAX(session_id) FROM cthx_test_session tes JOIN cthx_test t ON tes.test_id=t.test_id AND t.module_id=trm.module_id AND worker_id=' + globalObj.loggedInUserID + ') ' +
                   
                   'AND ' +
                   'tes.session_id IN ' +
                   '(SELECT session_id FROM cthx_test_session tes JOIN cthx_test t ' +
                   'ON tes.test_id=t.test_id AND ((tes.score/tes.total)*100)<40 AND worker_id=' + globalObj.loggedInUserID + ')';

    //console.log('Notifications getFailedTests: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    
                                    //set counts
                                    globalObj.failedTests =len;
                                    $('#failed').html(globalObj.failedTests);
                                    globalObj.totalNotificationCount += parseInt(len); //cummulate total count
                                    //console.log('failed: ' + globalObj.totalNotificationCount)
                                    //return count if count mode
                                    if(countMode == true) {
                                        //console.log('count mode failed: ' + globalObj.totalNotificationCount)
                                        $('#side_notif').html(globalObj.totalNotificationCount);
                                        return;
                                    }
                                    
                                    if(len>0){
                                          html = '<div class="row-content textfontarial12 ">';
                                            for (var i=0; i<len; i++){
                                                 var row = result.rows.item(i);
                                                 //console.log('result row: ' + JSON.stringify(row));
                                                 var ptage = row['score'] / row['total'] * 100;
                                                 var gradeText = getGradeText(ptage);  //found on cert.js
                                                 var score = row['score'];

                                                 html += '<div class="">' +
                                                            '<p id="grp-btn">' +
                                                                '<span class="row-content-col width40 textleft">' + row['title'] + '</span>' +
                                                                '<span class="row-content-col width20 textcenter">' + ptage + '/' + gradeText + '</span>' +
                                                                '<span class="row-content-col-btn width30">' +
                                                                    '<a  class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Retake Test</a>' +
                                                                    '<a  class="pagebutton" onclick="retakeTraining(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4% !important;" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>' +
                                                                '</span>' +
                                                            '</p>' +
                                                         '</div>' ;
                                                }
                                                html += '</div>';
                                        
                                        
                                        $('.focus-area').html(html);
                                        $('#context-bar').html('Notifications');
                                    }
                                    else{
                                        $('.focus-area').html(    
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No failed tests found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                        $('#context-bar').html('Notifications');
                                    }

                                }
                            );
                    });
 }
 
 /*
  * This function transfers the user to the training directly.
  */
 function c2TrainingFromNoti(topicID, moduleID){
     globalObj.topicID = topicID;
     globalObj.moduleID = moduleID;
     //first get the category to set the system variables correctly and sync'ed
     var query = 'SELECT category_id FROM cthx_training_module WHERE module_id='+ globalObj.moduleID;
     
     var success = function(){ $.mobile.changePage('training.html');  }
     var error = function(error){console.log('Error getting category ID: ' + JSON.stringify(error));}
     globalObj.db.transaction(function(tx){
         tx.executeSql(query,[],function(tx,result){
             globalObj.categoryID = result.rows.item(0)['category_id'];
         });
     },error,success);
 }
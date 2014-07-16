

$(document).on("#testspage", "pageshow", function () {
      //$("#testspage").trigger('create');
});

$(document ).delegate("#testspage", "pageinit", function() {        
        //categories query: an asynchronous call
        //_db.transaction(queryTests,errorCB);   
        doSummary();
//        doResults();
        //doPending();
        
 });
 
  
function doSummary()  {
    _db.transaction(querySummary,errorCB);   
}

function doPending()  {
    _db.transaction(queryPendingTests,errorCB);   
}

function doResults()  {
    _db.transaction(queryResults,errorCB);   
}
  
/**********************
*   Populates the Tests Page with test entries from database
**********************/  
 function queryPendingTests(tx){
     //console.log('inside queryTests');
     
    var query = 'SELECT * FROM cthx_test t1 WHERE t1.test_id NOT IN (SELECT DISTINCT test_id from cthx_test_session t2)';
    //console.log('Pending query: ' + query);
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html ='';
                    if(len>0){  //if not empty table
                        html += '<ul id="pendingList" data-role="listview" data-theme="d" >' ;
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             
                             html +='<li class="articleblock">' +
                                        '<a href="" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + '); return false;"  >' +
                                             //'<img src="img/logo.png" />' +
                                            '<h3>'+
                                                 row['title']+
                                             '</h3>' +
                                             //'<p class="marginbottom20">'+row['description']+'</p>' +
                                        '</a>' +
                                     '</li>';
                                     
                         }
                         html += '</ul>'
                         
                            $('#videopad').html(html); 
                            $("#testspage").trigger('create');
                    }
                    else{
                        $('#videopad').html('<li class="">No pending tests found.</li>'); 
                    }
                    
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 
 
 function querySummary(tx){
     console.log('inside createSummary');
    tx.executeSql('SELECT * FROM cthx_test_session WHERE worker_id='+_loggedInUserID,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html = '';
                    console.log('Test count: ' + len);
                    if(len>0){  //if not empty table
                        var failCount=0, passCount=0, sum=0;
                        
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             
                             var ptage = row['score'] / row['total'] * 100;
                             
                             if(ptage<40)   failCount++; else passCount++;
                             
                             sum += ptage;
                         }
                         
                         var avg = sum/len;
                         
                        html += '<ul id="summaryList" data-role="listview" data-theme="d" >' +
                                    '<li class="" data-icon="false">' +
                                        '<a>Total Tests Taken</a>' +
                                        '<span id="test-taken" class=ui-li-count>' + len + '</span>' +
                                    '</li>';
                        
                        html +=     '<li class="" data-icon="false">' + 
                                        '<a>Total Tests Passed</a>' +
                                        '<span id="test-passed" class=ui-li-count>' + passCount + '</span>' +
                                    '</li>';

                        html +=     '<li class="" data-icon="false">' +
                                        '<a>Total Tests Failed</a>' +
                                        '<span id="test-failed" class=ui-li-count>' + failCount + '</span>' +
                                    '</li>';

                        html +=     '<li class="" data-icon="false">' +
                                        '<a>Average Score Percentage</a>' +
                                        '<span id="test-avg" class=ui-li-count>' + avg + '</span>' +
                                    '</li>';

                        html += '</ul>';
                        
                        
                         $('#videopad').html(html); 
                         $("#testspage").trigger('create');
                    }
                    else{
                        $('#videopad').html('<li class="">No tests found.</li>'); 
                    }
                        
                    
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 
 
 
 function queryResults(tx){
     console.log('inside queryResults');
     var query = 'SELECT * FROM cthx_test_session s JOIN cthx_test t ON  s.test_id = t.test_id WHERE worker_id='+_loggedInUserID;
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html = '';
                    console.log('Test count: ' + len);
                    if(len>0){  //if not empty table       
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             var ptage = row['score'] / row['total'] * 100;
                             var gradeText = getGradeText(ptage);  //found on cert.js
                             var score = row['score'];
                             
                             html += '<div data-theme="d" class="resultline">' +
                                        '<p>'+
                                            '<span class="floatleft bold">' + row['title'] + '</span>' +
                                            '<span class="floatright">' + ptage + '/' + gradeText + '</span>' +
                                        '</p>' +
                                        '<br/>' + //needed
                                        '<p>' +
                                            '<a class="floatright" onclick="changeToTopic(' + row['module_id'] + ')" data-role="button" data-inline="true" data-theme="b">Retake Module</a>' +
                                            '<a class="floatright" onclick="changeToQuestion(' + row['test_id'] + ',' + row['module_id'] + ')" data-role="button" data-inline="true" data-theme="b">Retake Test</a>' +                            
                                        '</p>' +
                                     '</div>';
                            }
                            $("#videopad").html(html);                            
                            $("#testspage").trigger('create');
                    }
                    else{
                        $('#videopad').html('<li class="">No test results found.</li>'); 
                    }
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 
 
 
 function errorCB(error){
     alert('Database error: ' + JSON.stringify(error));
 }

function changeToQuestion(test_id, module_id){
    _testID = test_id;
    _moduleID = module_id;
    
    //checkModuleSessionsStatus can be found on training.js
    _db.transaction(checkStatusForTest,function(error){console.log('test check error')});
    
}


function changeToTraining(){
    $.mobile.changePage( "topics.html");
}


function checkStatusForTest(tx){
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
                  
                  //console.log('alltaken: ' + allTaken + ', sessiontype: ' + _sessionType);
                  if(allTaken == false){
                      //got to test 
                      console.log('check result: go to training')
                      //if(_sessionType==1)
                          $('#trainingPopup').popup('open');
                  }
                  else{
                      console.log('check result: all training done, go to test')
                      //change to test found on training.js. needs _moduleID but that was set in 
                      //changeToQuestion method that called this.
                      changeToTest();
                  }
                  
              }
              else{  //len is 0. Means user has no prior training session 
                  console.log('check result on else part: go to training')
                      //if(_sessionType==1)
                          $('#trainingPopup').popup('open');
              }
    });
}
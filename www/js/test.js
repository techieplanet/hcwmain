$(document ).delegate("#testpage", "pagebeforecreate", function() {
    globalObj.currentPage = 'testpage';
    createHeader('testpage','Assessment');
    createFooter('testpage');
    setNotificationCounts();
});

$(document).delegate("#testpage", "pageshow", function()    {
    setHeaderNotificationCount('testpage');
    //set active sidebar element on click
        $('#sidebar_ul li a').click(function(){
            $('#sidebar_ul li a').removeClass('active');
            $(this).addClass('active');
        });
});

$(document).delegate("#testpage", "pageinit", function() {        
        //alert('testpage');
        
        //show the footer logged in user
        showFooterUser();
    
        //sample initial string to split on - /phonegap/hcwdeploy/www/test.html?pagemode=1
        //1 - summary mode, 2 - certificate mode
        var pageMode = $('#testpage').attr('data-url').split('?')[1].split('=')[1];
        console.log('pagemode: ' + pageMode);
        
        if(pageMode == 1){ //summary, pending or result
            if($("body").data('testTab')!=null){
                var currentTab = $("body").data('testTab');
                if(currentTab == 'pending'){
                    showPending();
                    $('#sidebar_ul li a').removeClass('active');
                    $('#pending').addClass('active');
                }
                else if(currentTab == 'results'){
                    showResults();
                    $('#sidebar_ul li a').removeClass('active');
                    $('#results').addClass('active');
                }
                else if(currentTab == 'summary'){
                    showSummary();
                    $('#sidebar_ul li a').removeClass('active');
                    $('#summary').addClass('active');
                }
                else{ //for initial access when noting has been selected
                    showPending();
                }
            }
            else{
                showPending();
            }
        }
        else if(pageMode==2){ //certificate
            showCert();
        }
        
        
});


function showSummary()  {
    $("body").data( "testTab" , 'summary');
    console.log('body test data: ' + JSON.stringify($("body").data()));
    globalObj.db.transaction(querySummary,errorCB);   
}

function showPending()  {
    $("body").data( "testTab" , 'pending');
    console.log('body test data: ' + JSON.stringify($("body").data()));
    globalObj.db.transaction(queryPendingTests,errorCB);   
}

function showResults()  {
    $("body").data( "testTab" , 'results');
    console.log('body test data: ' + JSON.stringify($("body").data()));
    globalObj.db.transaction(queryResults,errorCB);   
}



function querySummary(tx){
     console.log('inside createSummary');
    tx.executeSql('SELECT * FROM cthx_test_session WHERE worker_id='+globalObj.loggedInUserID,[],
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
                         avg = avg==null ? 0 : Math.round(avg*100)/100;
                         
                        html += '<ul class="content-listing textfontarial12 margintop10" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p class="margintop5">Total Tests Taken' +
                                            '<span id="test-taken" class=ui-li-count>' + len + '</span>' +
                                        '</p>' +
                                    '</li>';
                        
                        html +=     '<li class="" data-icon="false">' + 
                                        '<p class="margintop5">Total Tests Passed' +
                                            '<span id="test-passed" class=ui-li-count>' + passCount + '</span>' +
                                        '</p>' +
                                    '</li>';

                        html +=     '<li class="" data-icon="false">' +
                                        '<p class="margintop5">Total Tests Failed' +
                                            '<span id="test-failed" class=ui-li-count>' + failCount + '</span>' +
                                        '</p>' +
                                    '</li>';

                        html +=     '<li class="" data-icon="false">' +
                                        '<p class="margintop5">Average Score Percentage' +
                                            '<span id="test-avg" class=ui-li-count>' + avg + '</span>' +
                                        '</p>' +
                                    '</li>';

                        html += '</ul>';
                        
                        
                         $('.focus-area').html(html); 
//                         $('.c-title').html('Summary');
//                         $('#context-bar').html('Details');
//                         $("#testpage").trigger('create');
                    }
                    else{
                        $('.focus-area').html(
                                    '<ul id="summaryList" data-role="listview">' +
                                        '<li class="margintop10" data-icon="false">' +
                                            '<p>No test details found.</p>' +
                                        '</li>' +
                                    '</ul>'
                                 ); 
                    }
                    
                    //set the heading...has to run whether or not there were rows to display
                    $('.c-title').html('Summary ' + '<small>(Summary of your test scores)</small>');
                    $('#context-bar').html('Details');
                    $("#testpage").trigger('create');
                        
                    
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }


/**********************
*   Populates the Tests Page with test entries from database
*   Tests that have never been done by the user.
**********************/  
 function queryPendingTests(tx){
    //console.log('inside querypending');  
    
    var query = 'SELECT * FROM cthx_test t WHERE t.test_id NOT IN (SELECT DISTINCT(test_id) from cthx_test_session s)';
    //console.log('Pending query: ' + query);
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html ='';
                    if(len>0){  //if not empty table
                        html += '<div class="row-content textfontarial12 ">' ;
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             
                             html += '<div>' +
                                        '<p>' +
                                            '<span class="row-content-col width60 textleft">' + row['title'] + '</span>' +
                                            '<span id="row-content-col" class="width10">&nbsp;</span>' +
                                            '<span class="row-content-col-btn width30">' +
                                                '<a  class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + '); return false;" data-theme="d" data-role="button"  data-inline="true" >Take test now</a>' +
                                            '</span>' +
                                        '</p>' +
                                     '</div>';
                                     
                         }
                         html += '</div>'
                         
                            $('.focus-area').html(html); 
                    }
                    else{
                        $('.focus-area').html(
                                    '<ul id="summaryList" data-role="listview">' +
                                        '<li class="margintop10" data-icon="false">' +
                                            '<p>No tests found.</p>' +
                                        '</li>' +
                                    '</ul>'
                                 ); 
                    }
                    
                    //set the heading...has to run whether or not there were rows to display
                    $('#context-bar').html(
                         '<span id="column-width" class="width60 textleft">Module</span>' +
                         '<span id="column-width" class="width10">&nbsp;</span>' +
                         '<span id="column-width" class="width30 textcenter">Action</span>'
                     );
                     $('.c-title').html('Pending ' + '<small>(Tests you have never attempted)</small>');
                     $("#testpage").trigger('create');
                    
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 
 
function queryResults(tx){
     //console.log('inside queryResults');
     var query = 'SELECT * FROM cthx_test_session s JOIN cthx_test t ON  s.test_id = t.test_id WHERE worker_id='+globalObj.loggedInUserID;
    tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    var len = resultSet.rows.length;
                    var html = '';
                    console.log('Test count: ' + len);
                    if(len>0){  //if not empty table       
                        html += '<div class="row-content textfontarial12 ">';
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                             console.log('result row: ' + JSON.stringify(row));
                             var ptage = row['score'] / row['total'] * 100;
                             var gradeText = getGradeText(ptage);  //found on cert.js
                             var score = row['score'];
                             
                             html += '<div class="vpadding10">' +
                                        '<p id="grp-btn">' +
                                            '<span class="row-content-col width40 textleft">' + row['title'] + '</span>' +
                                            '<span class="row-content-col width20 textcenter">' + ptage + '/' + gradeText + '</span>' +
                                            '<span class="row-content-col-btn width30">' +
                                                '<a  class="pagebutton" style="margin-bottom:10px;" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + ');" data-theme="d" data-role="button"  data-inline="true" >Retake Test</a>' ;
                                           if(ptage<40){
                                                html += '<a  class="pagebutton" style="margin-top:5px !important;" onclick="retakeTraining(' + row['test_id']+ ',' + row['module_id'] + ');" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>';
                                           }
                             html +=        '</span>' +
                                        '</p>' +
                                     '</div>';
                            }
                            html += '</div>';
                            
                            $('.focus-area').html(html); 
                            
                    }//end if
                    else{
                        $('.focus-area').html(
                                    '<ul id="summaryList" data-role="listview">' +
                                        '<li class="margintop10" data-icon="false">' +
                                            '<p>No test results found.</p>' +
                                        '</li>' +
                                    '</ul>'
                                 ); 
                    }
                    
                    
                    //set the heading...has to run whether or not there were rows to display
                    $('#context-bar').html(
                         '<span id="column-width" class="width40 textleft">Module</span>' +
                         '<span id="column-width" class="width20 textleft">Score/Grade</span>' +
                         '<span id="column-width" class="width30">Action</span>'
                     );
                     $('.c-title').html('Results ' + '<small>(History of all tests you have ever done.)</small>');
                     $("#testpage").trigger('create');
                },
                    function errorCB(error){
                        alert('Error loading tests: ' + JSON.stringify(error));
                    }
                );
                
 }
 
 
function changeToQuestion(test_id, module_id){
    globalObj.testID = test_id;
    globalObj.moduleID = module_id;
    
    //checkModuleSessionsStatus can be found on training.js
    globalObj.db.transaction(checkStatusForTest,function(error){console.log('test check error')});
}

function retakeTraining(test_id, module_id){
    globalObj.testID = test_id;
    globalObj.moduleID = module_id;
    console.log('testID: ' + globalObj.testID + ' moduleID: ' + globalObj.moduleID);
    
    globalObj.db.transaction(function(tx){
        var query = "SELECT category_id FROM cthx_training_module WHERE module_id="+globalObj.moduleID;
        tx.executeSql(query,[],function(tx,result){
            globalObj.categoryID = result.rows.item(0)['category_id'];
            $.mobile.changePage( "training_home.html?pageMode=2"); //page mode 2 is retake training mode
        });
    });
}


/*
 * This method tests if the logged in user has taken all the tests in the current module
 * If so, prompt user to take test
 * Tables: training_to_module, training_session
 */
function checkStatusForTest(tx){
    var query = 'SELECT * FROM cthx_training_to_module ttm JOIN cthx_training t WHERE ' +
                 '(ttm.training_id = t.training_id AND ttm.module_id=' + globalObj.moduleID + ' AND ttm.module_id NOT IN ' +
                 '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE trs1.module_id=' + globalObj.moduleID + ' AND material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') ' +
                 'AND ' +
                 '(ttm.module_id=' + globalObj.moduleID + ' AND ttm.training_id NOT IN ' +
                 '(SELECT trs.training_id FROM cthx_training_session trs WHERE trs.module_id=' + globalObj.moduleID + ' AND status=2 AND worker_id=' + globalObj.loggedInUserID + ')))';
             
    console.log('check query: ' + query);
    
    tx.executeSql(query,[],
                    function(tx,result){
                        var len = result.rows.length;
                        console.log('check length: ' + len);
                        if(len==0){
                                console.log('check result: go to test')
                                changeToTest();
                          }
                          else{
                              console.log('check result: test deep');
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
                                //console.log('check result: go to training')
                                $('#testcheckPopup #sessionok').attr('onclick','retakeTraining('+globalObj.testID + ',' + globalObj.moduleID + ')');
                                $('#testcheckPopup').popup('open');
                              }
                              else{
                                  changeToTest();
                              }
                           }//end outer else
                    }
             );
}

///*
// * This method tests if the logged in user has taken all the tests in the current module
// * If so, prompt user to take test
// * Tables: training_to_module, training_session
// */
//function checkStatusForTest(tx){
////     var query = 'SELECT status FROM cthx_training_to_module tm LEFT JOIN cthx_training_session s ON ' + 
////                 'tm.training_id=s.training_id AND s.worker_id=' + globalObj.loggedInUserID + 
////                 ' WHERE tm.module_id='+globalObj.moduleID;
//         
//    var query = 'SELECT DISTINCT(ttm.module_id),module_title,test_id FROM cthx_training_to_module ttm JOIN cthx_training_module trm JOIN cthx_test t ON ' +
//                'ttm.module_id=trm.module_id AND trm.module_id=t.module_id WHERE trm.module_id IN ' +   //get all mapped rows
//                '(SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') AND ' +     //include only the modules the user has touched their training(s) in the set
//
//                //all completed modules either via video or guide
//                '(trm.module_id IN ' +
//                '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') OR ' +  //user has viewd guide for this module (i.e completed module training) OR
//                'trm.module_id IN ' +   
//                '(SELECT DISTINCT(trs2.module_id) FROM cthx_training_session trs2 WHERE trs2.module_id NOT IN (SELECT trs3.module_id FROM cthx_training_session trs3 WHERE status=1 AND trs3.worker_id=' + globalObj.loggedInUserID + ')))';
//
//    console.log('check query: ' + query);
//    
//    tx.executeSql(query,[],function(tx,resultSet){
//              var len = resultSet.rows.length;
//              console.log('check length: ' + len);
//              if(len>0){
//                  var allTaken = true;
//                  for(var i=0; i<len;i++){
//                      var row = resultSet.rows.item(i);
//                      
//                      console.log('this row: ' + JSON.stringify(row));
//                      //check if the training is either not taken or its session not completed
//                      if(row['material_type']==2){
//                          //regardless of any other conditions, the training is completed as long
//                          //as training guide has been viewed
//                          //Break out, no need to keep checking.
//                            allTaken = true;
//                            break;
//                      }
//                      else if(row['material_type']==1 && row['status'] != 2) {
//                          //material_type 1 is video. Status != 2 means the video was not completed
//                          //But keep checking as we do not know if training guide was viewed later
//                          allTaken = false;
//                       }
//                  }
//                  
//                  console.log('alltaken: ' + allTaken);
//                  if(allTaken == true){
//                      //got to test 
//                      console.log('check result: go to test')
//                      changeToTest();
//                  }
//                  else{
//                      console.log('check result: go to training')
//                      $('#testcheckPopup').popup('open');
//                  }
//                  
//              }
//              else{  //len is 0. Means user has no prior training session 
//                  console.log('check result: go to training2')
//                      $('#testcheckPopup').popup('open');
//              }
//    });
//}

function changeToTraining(){
    $.mobile.changePage( "training_home.html?pageMode=retake");
}

function changeToTest(){
    globalObj.db.transaction(function(tx){
                     query = 'SELECT test_id FROM cthx_test WHERE module_id='+globalObj.moduleID;
                     tx.executeSql(query,[],
                                    function(tx,resultSet){
                                        var len = resultSet.rows.length;
                                        if(len>0){
                                            globalObj.testID = resultSet.rows.item(0)['test_id'];
                                            $.mobile.changePage('question.html');
                                        }
                                 });
    });
}



function showCert(){
    console.log('showcert: ' + globalObj.moduleID);
    
    var html ="";
    
    html += '<ul class="content-listing textfontarial12 margintop10" data-role="listview">' +
                '<li class="" data-icon="false">' +
                    '<p>Score' + 
                        '<span id="certscore" class=ui-li-count>' + 
                            globalObj.testScore +
                        '</span>' +
                    '</p>'
                '</li>';
            
    html +=     '<li class="" data-icon="false">' +
                    '<p>Total Possible' +
                        '<span id="certtotal" class=ui-li-count>' +
                            globalObj.testTotal +
                        '</span>'
                    '</p>'
                '</li>';
                
    html +=     '<li class="" data-icon="false">' +
                    '<p class="bold textcenter" style="padding-top:1em !important; font-size:15px;">' +
                        gradeCalc(globalObj.testScore, globalObj.testTotal) +
                    '</p>'
                '</li>';

   html += '</ul>'
   
   $('.focus-area').html(html);
   $('.c-title').html(globalObj.testTitle + ' Assessment')
   $('#context-bar').html('Certificate');
   $('#testpage').trigger('create');
}



function gradeCalc(score,total){
    var ptage = score * 100 / total;
    return getGradeLongText(ptage);
}

function getGradeLongText(ptage){
    var str = '';
    if(ptage < 40){
        console.log('fail area');
        str = 'Score of ' + ptage + '% is below par. You may want to retake this test<br/><br/>';
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
        str +=         '<a href="question.html" class="pagebutton textcenter"  data-role="button"  data-inline="true">Retake Test</a>';
        str +=         '<a  class="pagebutton textcenter" style="margin-left: 15px !important;" onclick="retakeTraining(' + globalObj.testID + ',' + globalObj.moduleID + ');" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>';
        str +=     '</div>';
    }
    else if(ptage >= 40 && ptage < 60){
        str = 'Score of ' + ptage + '% not so good. You may want to retake this test for higher scores<br/><br/>';
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
        str +=         '<a id="login" href="question.html" class="pagebutton textcenter"  data-role="button"  data-inline="true">Retake Test</a>';
        str +=     '</div>';
        //str += '<a style="padding:4%;" href="question.html" class="pagebutton width60 padtwo textcenter" data-theme="b" data-role="button" >Retake Test</a>';
    }
    else if(ptage >= 60 && ptage < 80){
        str = 'Score of ' + ptage + '% is okay but you may want to retake this test for even higher scores<br/><br/>';
        str +=     '<div data-role="fieldcontain" class="fieldrow nomargin">';
        str +=         '<a href="question.html" class="pagebutton textcenter"  data-role="button"  data-inline="true">Retake Test</a>'
        str +=     '</div>';
        //str += '<a style="padding:4%;" href="question.html" class="pagebutton width60 padtwo textcenter" data-theme="b" data-role="button" >Retake Test</a>';
    }
    else {
        str = 'You scored ' + ptage + '%. Good job!';
    }
    
    return str;
}


function getGradeText(ptage){

    if(ptage < 40){
        return 'Fail';
    }
    else if(ptage >= 40 && ptage < 60){
        return 'Underperformed';
    }
    else if(ptage >= 60 && ptage < 80){
        return 'Average'
    }
    else {
        return 'High Performance'
    }
    
}
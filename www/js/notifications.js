var buttonGroup='';
function showNotifications(){
    globalObj.db.transaction(queryNotifications,errorCB);   
}


function queryNotifications(tx){
//    var query = 'SELECT DISTINCT(trs.module_id),module_title FROM cthx_training_session trs JOIN cthx_training_module trm ON ' +
//                'trs.module_id=trm.module_id AND trs.worker_id=' + globalObj.loggedInUserID + ' WHERE trs.module_id ' +
//                'NOT IN (SELECT t.module_id FROM cthx_test t JOIN cthx_test_session tes WHERE t.test_id=tes.test_id AND tes.worker_id=' + globalObj.loggedInUserID + ')';

    buttonGroup = '<div id="bgroup" data-role="controlgroup" data-type="horizontal">' +
                            '<a id="buttonInc" href="" onclick="getIncompleteTrainings()" data-role="button">Uncompleted Training</a>  ' +
                            '<a id="buttonDue" href="" onclick="getUndoneTests()" data-role="button">Waiting Assessments</a>  ' +
                            '<a id="buttonFail" href="" onclick="getFailedTests()" data-role="button">Failed Assessments</a>  ' +
                      '</div>  <br/>';
                  
   $('.focus-area').html(buttonGroup);
   $('#context-bar').html('Notifications');
 }
 
 /*
  * The metod gets all trainings mapped to the modules the user has done
  * and points out all trainings in those modules the user has not done or has not completeed
  * Tables: training_tom_module, training_module, training_session, traininig session
  * 
  */
 function getIncompleteTrainings(){
                      
    var query = 'SELECT ttm.module_id,ttm.training_id,module_title,training_title FROM cthx_training_to_module ttm JOIN cthx_training_module trm JOIN cthx_training t ON ' +
                'ttm.module_id=trm.module_id AND ttm.training_id=t.training_id WHERE trm.module_id IN ' +       //helps get full details of modules and trainings in set
                '(SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') AND ' +   //all modules the user has taken training in goes into the set
                'trm.module_id NOT IN ' +
                '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') AND ' +  //exclude modules whicj the user has has viewed their guide from set
                'ttm.training_id NOT IN ' +
                '(SELECT trs2.training_id FROM cthx_training_session trs2 WHERE status=2 AND trs2.worker_id=' + globalObj.loggedInUserID + ')';     //exclude video topics which the user has completed from set

    console.log('Notifications: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    var html ='<ul class="content-listing textfontarial12" data-role="listview">';
                                    if(len>0){
                                        for(var i=0; i<len; i++){
                                            var row = result.rows.item(i);
                                                html += '<li  data-icon="false" class="bottomborder">' +
                                                            '<a href="#" onclick="c2TrainingFromNoti(' + row['training_id'] + ',' + row['module_id'] + ')" class="margintop10 notextdecoration textblack">' +
                                                                '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                                                '<p class="">Topic: ' + row['training_title'] + '</p>' +
                                                            '</a>' +
                                                        '</li>';
                                        }

                                        html += '</ul>';
                                        
                                        html = buttonGroup + html;
                                        
                                        $('.focus-area').html(html);
                                    }
                                    else{                                                    
                                        $('.focus-area').html(   buttonGroup +    
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No uncompleted trainings found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                    }

                                }
                            );
                    });
 }
 
 
 
 function getUndoneTests(){
                      
    var query = 'SELECT DISTINCT(ttm.module_id),module_title,test_id FROM cthx_training_to_module ttm JOIN cthx_training_module trm JOIN cthx_test t ON ' +
                'ttm.module_id=trm.module_id AND trm.module_id=t.module_id WHERE trm.module_id IN ' +   //get all mapped rows
                '(SELECT DISTINCT(trs.module_id) FROM cthx_training_session trs WHERE worker_id=' + globalObj.loggedInUserID + ') AND ' +     //include only the modules the user has touched their training(s) in the set

                //all completed modules either via video or guide
                '(trm.module_id IN ' +
                '(SELECT DISTINCT(trs1.module_id) FROM cthx_training_session trs1 WHERE material_type=2 AND worker_id=' + globalObj.loggedInUserID + ') OR ' +  //user has viewd guide for this module (i.e completed module training) OR
                'trm.module_id IN ' +   
                '(SELECT DISTINCT(trs2.module_id) FROM cthx_training_session trs2 WHERE trs2.module_id NOT IN (SELECT trs3.module_id FROM cthx_training_session trs3 WHERE status=1 AND trs3.worker_id=' + globalObj.loggedInUserID + '))) AND ' + //user has watched all videos in module. Collects only modu;es where no incomplete videos are found
                
                //filter all the modules whose test had been done and leave only those with no test but completed training
                'trm.module_id NOT IN ' +
                '(SELECT DISTINCT(t2.module_id) FROM cthx_test_session tes JOIN cthx_test t2 ON t2.test_id=tes.test_id WHERE tes.worker_id=' + globalObj.loggedInUserID + ')'; 

    console.log('Notifications getUndoneTests: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    if(len>0){
                                          html = '<div class="row-content textfontarial12 ">' ;
                                            for (var i=0; i<len; i++){
                                                 var row = result.rows.item(i);

                                                 html += '<div>' +
                                                            '<p>' +
                                                                '<span class="row-content-col width60 textleft">' + row['module_title'] + '</span>' +
                                                                '<span id="row-content-col" class="width10">&nbsp;</span>' +
                                                                '<span class="row-content-col-btn width30">' +
                                                                    '<a  class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + '); return false;" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Take test now</a>' +
                                                                '</span>' +
                                                            '</p>' +
                                                         '</div>';

                                             }
                                             html += '</div>';
                                        
                                        html = buttonGroup + html;
                                        
                                        $('.focus-area').html(html);
                                        $('#context-bar').html('Notifications: You completed these training modules, tests yet to be done ');
                                    }
                                    else{
                                        $('.focus-area').html(  buttonGroup +     
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No waiting tests for completed module trainings found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                        //$('#context-bar').html('Notifications');
                                    }

                                }
                            );
                    });
 }
 
 
 function getFailedTests(){
     var query = 'SELECT * FROM cthx_test_session tes JOIN cthx_test t ON ' +
                 'tes.test_id=t.test_id WHERE ' +
                 'session_id = (SELECT MAX(tes1.session_id) FROM cthx_test_session tes1 WHERE tes1.test_id=t.test_id AND ((tes1.score/tes1.total)*100)<40 ) AND ' +
                 'worker_id=1';

    console.log('Notifications getFailedTests: ' + query);
    
    globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],
                                function(tx,result){
                                    var len = result.rows.length;
                                    if(len>0){
                                          html = '<div class="row-content textfontarial12 ">';
                                            for (var i=0; i<len; i++){
                                                 var row = result.rows.item(i);
                                                 console.log('result row: ' + JSON.stringify(row));
                                                 var ptage = row['score'] / row['total'] * 100;
                                                 var gradeText = getGradeText(ptage);  //found on cert.js
                                                 var score = row['score'];

                                                 html += '<div class="">' +
                                                            '<p id="grp-btn">' +
                                                                '<span class="row-content-col width40 textleft">' + row['title'] + '</span>' +
                                                                '<span class="row-content-col width20 textcenter">' + ptage + '/' + gradeText + '</span>' +
                                                                '<span class="row-content-col-btn width30">' +
                                                                    '<a  class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Retake Test</a>' +
                                                                    '<a  class="pagebutton" onclick="retakeTraining(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>' +
                                                                '</span>' +
                                                            '</p>' +
                                                         '</div>' ;
                                                }
                                                html += '</div>';
                                        
                                        html = buttonGroup + html;
                                        
                                        $('.focus-area').html(html);
                                        $('#context-bar').html('Notifications');
                                    }
                                    else{
                                        $('.focus-area').html(    buttonGroup +   
                                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                                    '<li class="" data-icon="false">' +
                                                        '<p>No failed tests found.</p>' +
                                                    '</li>' +
                                                '</ul>'
                                             );
                                        //$('#context-bar').html('Notifications');
                                    }

                                }
                            );
                    });
 }
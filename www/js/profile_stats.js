function brkTrainingsCompleted(){
    globalObj.profileStatDetailsView = true;
    
    var query = 'SELECT DISTINCT(t.training_id), training_title, module_title  FROM cthx_training t JOIN cthx_training_module tm JOIN cthx_training_session trs ' +
                'ON t.training_id=trs.training_id AND trs.module_id=tm.module_id ' +
                'WHERE status=2 AND material_type=1 AND worker_id=' + globalObj.loggedInUserID +
                ' ORDER BY trs.module_id';
            
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                    var len = result.rows.length;
                    console.log('len brkTrainingsCompleted: ' + len);
                    if(len>0){
                        var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);

                             html += '<li  data-icon="false" class="bottomborder floatleft">' +
                                            '<div class="width90 floatleft">' +
                                                '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                                '<p class="width95">Topic: ' + row['training_title'] + '</p>' +
                                            '</div>' +
                                        '</li>';
                        }
                        html += '</ul>';
                                        
                        $('.focus-area').html(html);
                        $('#context-bar').html('Completed Video Trainings');
                        
                    }
                    else{                                                    
                        $('.focus-area').html(      
                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p>No completed video trainings.</p>' +
                                    '</li>' +
                                '</ul>'
                             );
                        $('#context-bar').html('Completed Video Trainings');
                    }
                    
                    console.log('after if stmt');
                    
                    //back to usage stats
                    $('.c-title').append(
                        '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                            '<a href="#" onclick="showUsage();return false;" class="pagebutton pagebuttonpadding textwhite" >Show All Stats</a>' +
                        '</span>'
                     );
            });
        });
}

//    query
//    get data
//    update focus area
//    update context bar
//    add some text to ctitle
//    back to usage button
function brkTrainingsUnCompleted(){
    globalObj.profileStatDetailsView = true;
    
    var query = 'SELECT DISTINCT(t.training_id), training_title, tm.module_id, module_title  ' + 
                'FROM cthx_training t JOIN cthx_training_module tm JOIN cthx_training_session trs ' +
                'ON t.training_id=trs.training_id AND trs.module_id=tm.module_id ' +
                'WHERE status=1 AND material_type=1 AND worker_id=' + globalObj.loggedInUserID +
                ' ORDER BY trs.module_id';
            
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                    var len = result.rows.length;
                    console.log('len brkTrainingsCompleted: ' + len);
                    if(len>0){
                        var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);

                             html += '<li  data-icon="false" class="bottomborder floatleft">' +
                                            '<div class="width60 floatleft">' +
                                                '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                                '<p class="width95">Topic: ' + row['training_title'] + '</p>' +
                                            '</div>' +
                                            '<div class="width30 floatright margintop15">' +
                                                '<a  class="pagebutton disableinsandbox" onclick="c2TrainingFromNoti(' + row['training_id'] + ',' + row['module_id'] + '); return false;" style="padding:6% 8%;" data-theme="d" data-role="button"  data-inline="true" >Go to Training</a>' +
                                            '</div>' +
                                        '</li>';
                        }
                        html += '</ul>';
                                        
                        $('.focus-area').html(html);
                        $('#context-bar').html('Uncompleted Video Trainings');
                        
                    }
                    else{                                                    
                        $('.focus-area').html(      
                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p>No completed video trainings.</p>' +
                                    '</li>' +
                                '</ul>'
                             );
                        $('#context-bar').html('Uncompleted Video Trainings');
                    }
                    
                    console.log('after if stmt');
                    
                    //back to usage stats
                    $('.c-title').append(
                        '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                            '<a href="#" onclick="showUsage();return false;" class="pagebutton pagebuttonpadding textwhite" >Show All Stats</a>' +
                        '</span>'
                     );
            });
        });
}


function brkTrainingDue(){
    globalObj.profileStatDetailsView = true;
    
    var query = 'SELECT DISTINCT(t.training_id), training_title, ttm.module_id, trm.module_title FROM cthx_training t JOIN cthx_training_to_module ttm JOIN cthx_training_module trm ' +
                'ON t.training_id=ttm.training_id AND ttm.module_id=trm.module_id WHERE t.video_file != "" ' + 
                'AND t.training_id NOT IN ' +
                '(SELECT DISTINCT(training_id) from cthx_training_session s ' +
                'WHERE s.worker_id=' + globalObj.loggedInUserID + ') ' +
                'ORDER BY ttm.module_id';
            
            
           console.log('inside brkTrainingDue: ' + query);
            
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                    var len = result.rows.length;
                    console.log('len brkTrainingsCompleted: ' + len);
                    if(len>0){
                        var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);

                             html += '<li  data-icon="false" class="bottomborder floatleft">' +
                                            '<div class="width60 floatleft">' +
                                                '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                                '<p class="width95">Topic: ' + row['training_title'] + '</p>' +
                                            '</div>' +
                                            '<div class="width30 floatright margintop15">' +
                                                '<a  class="pagebutton disableinsandbox" onclick="c2TrainingFromNoti(' + row['training_id'] + ',' + row['module_id'] + '); return false;" style="padding:6% 8%;" data-theme="d" data-role="button"  data-inline="true" >Go to Training</a>' +
                                            '</div>' +
                                        '</li>';
                        }
                        html += '</ul>';
                                        
                        $('.focus-area').html(html);
                        $('#context-bar').html('Trainings Yet To Be Accessed');
                        
                    }
                    else{                                                    
                        $('.focus-area').html(      
                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p>No completed video trainings.</p>' +
                                    '</li>' +
                                '</ul>'
                             );
                        $('#context-bar').html('Trainings Yet To Be Accessed');
                    }
                    
                    console.log('after if stmt');
                    
                    //back to usage stats
                    $('.c-title').append(
                        '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                            '<a href="#" onclick="showUsage();return false;" class="pagebutton pagebuttonpadding textwhite" >Show All Stats</a>' +
                        '</span>'
                     );
                         
            });
        });
}


function brkTrainingGuideTaken(){
    globalObj.profileStatDetailsView = true;
    
        var query = 'SELECT DISTINCT(trs.module_id), module_title FROM cthx_training_session trs JOIN cthx_training_module trm ' +
                    'ON trs.module_id=trm.module_id ' +
                    'WHERE worker_id=' + globalObj.loggedInUserID + ' AND material_type=2 ' +
                    'ORDER BY trs.module_id';
            
            
           console.log('inside brkTrainingDue: ' + query);
            
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                    var len = result.rows.length;
                    if(len>0){
                        var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);

                             html += '<li  data-icon="false" class="bottomborder floatleft">' +
                                            '<div class="width90 floatleft">' +
                                                '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                            '</div>' +
                                        '</li>';
                        }
                        html += '</ul>';
                                        
                        $('.focus-area').html(html);
                        $('#context-bar').html('Training Guides Completed');
                        
                    }
                    else{                                                    
                        $('.focus-area').html(      
                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p>No completed video trainings.</p>' +
                                    '</li>' +
                                '</ul>'
                             );
                        $('#context-bar').html('Training Guides Completed');
                    }
                    
                    console.log('after if stmt');
                    
                    //back to usage stats
                    $('.c-title').append(
                        '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                            '<a href="#" onclick="showUsage();return false;" class="pagebutton pagebuttonpadding textwhite" >Show All Stats</a>' +
                        '</span>'
                     );
                         
            });
        });
}


function brkTestsPassed(){
    globalObj.profileStatDetailsView = true;
    
    var query = 'SELECT DISTINCT (tes.test_id), module_title FROM cthx_test_session tes JOIN cthx_test t JOIN cthx_training_module trm ' +
                'ON tes.test_id=t.test_id AND t.module_id=trm.module_id ' +
                'WHERE worker_id=' + globalObj.loggedInUserID + ' AND ROUND((score/total)*100) >= 40'; 
            
           console.log('inside brkTestsPassed: ' + query);
            
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                    var len = result.rows.length;
                    if(len>0){
                        var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                        for(var i=0; i<len; i++){
                            var row = result.rows.item(i);

                             html += '<li  data-icon="false" class="bottomborder floatleft">' +
                                            '<div class="width90 floatleft">' +
                                                '<p class="bold"> Module: ' + row['module_title'] + '</p>' +
                                            '</div>' +
                                        '</li>';
                        }
                        html += '</ul>';
                                        
                        $('.focus-area').html(html);
                        $('#context-bar').html('Tests Passed');
                        
                    }
                    else{                                                    
                        $('.focus-area').html(      
                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p>No completed video trainings.</p>' +
                                    '</li>' +
                                '</ul>'
                             );
                        $('#context-bar').html('Tests Passed');
                    }
                    
                    console.log('after if stmt');
                    
                    //back to usage stats
                    $('.c-title').append(
                        '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                            '<a href="#" onclick="showUsage();return false;" class="pagebutton pagebuttonpadding textwhite" >Show All Stats</a>' +
                        '</span>'
                     );
                         
                    
            });
        });
}



function brkTestsFailed(){    
    globalObj.profileStatDetailsView = true;
    
    var query = 'SELECT DISTINCT (tes.test_id), trm.module_id, module_title FROM cthx_test_session tes JOIN cthx_test t JOIN cthx_training_module trm ' +
                'ON tes.test_id=t.test_id AND t.module_id=trm.module_id ' +
                'WHERE worker_id=' + globalObj.loggedInUserID + ' AND ROUND((score/total)*100) < 40'; 

           
        console.log('inside brkTestsFailed: ' + query);
            
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                    var len = result.rows.length;
                    //alert('length: ' + len);
                    if(len>0){
                        html = '<div class="row-content textfontarial12 ">';
                        for (var i=0; i<len; i++){
                             var row = result.rows.item(i);

                             html += '<div class="vpadding10">' +
                                        '<p id="grp-btn">' +
                                            '<span class="row-content-col width40 textleft">' + row['module_title'] + '</span>' +
                                            '<span class="row-content-col-btn width30">' +
                                                '<a  class="pagebutton" onclick="changeToQuestion(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4%;" data-theme="d" data-role="button"  data-inline="true" >Retake Test</a>' +
                                                '<a  class="pagebutton disableinsandbox" onclick="retakeTraining(' + row['test_id']+ ',' + row['module_id'] + ');" style="padding:4% !important; margin-top:5px !important;" data-theme="d" data-role="button"  data-inline="true" >Retake Training</a>' +
                                            '</span>' +
                                        '</p>' +
                                     '</div>' ;
                            }
                            html += '</div>';

                            $('.focus-area').html(html);
                            $('#context-bar').html('Failed Tests');
                    }
                    else{                                                    
                        $('.focus-area').html(      
                                '<ul class="content-listing textfontarial12" data-role="listview">' +
                                    '<li class="" data-icon="false">' +
                                        '<p>No failed tests found.</p>' +
                                    '</li>' +
                                '</ul>'
                             );
                        $('#context-bar').html('Failed Tests');
                    }
                    
                    console.log('after if stmt');
                    
                    //back to usage stats
                    $('.c-title').append(
                        '<span class="floatright textfontarial13 width50 textright" style="margin-top:4px">' +
                            '<a href="#" onclick="showUsage();return false;" class="pagebutton pagebuttonpadding textwhite" >Show All Stats</a>' +
                        '</span>'
                     );
                         
            });
        });
}
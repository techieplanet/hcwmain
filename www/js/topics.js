
$(document).delegate("#topicspage", "pageinit", function() {
    _db.transaction(queryTopics,errorCB);    //modules query: an asynchronous call
    
    if(_loggedInUserID > -1){  //user is logged in
        console.log('LOGGED IN');
        //console.log('topic pageinit: ' + DAO.firstName);
        //getUserPendingSession(); //you can now access the resultset via DAO.resultSet
    }
});


function queryTopics(tx){
    console.log('module id: ' + _moduleID);
    tx.executeSql('SELECT * FROM cthx_training WHERE module_id='+_moduleID,[],
                function(tx,resultSet){  //query success callback
                    //console.log('inside topic success');
                    var len = resultSet.rows.length;
                    if(len>0){  //if not empty table
                        for (var i=0; i<len; i++){
                             var row = resultSet.rows.item(i);
                              $('#topicsList').append(
                                  '<li class="articleblock">' +
                                     '<a href="" onclick="topicStarter(' + row['training_id'] + '); return false;" class="trans" >' +
                                          '<img src="img/topic-icon.png" />' +
                                         '<h5>'+
                                              row['training_title']+
                                          '</h5>' +
                                     '</a>' +
                                  '</li>'
                              );
                         }
                    }
                    else{
                        $('#topicsList').append('<li class="">No topics found.</li>'); 
                    }
                        
                    $("#topicsList").listview();
                    //$("#topicsList").trigger("create");  
                },
                
                function errorCB(error){
                    console.log('Error loading topics: ' + JSON.stringify(error));
                }
           );
}

                    
function topicStarter(topic_id){
    _topicID = topic_id; //selected topic id
    var pendingTopicID ='';
    
    if(_loggedInUserID > -1){  //user is logged in
        //console.log('topicStarter resultset: ' + _resultSet.item(0)['training_id']);
        //console.log('pending training id: ' + DAO.resultSet['training_id']); 
        if(_resultSet != null){
            pendingTopicID = _resultSet.item(0)['training_id'];
            _hasPendingSession = true;
        }
        
        //console.log('pendingTopicID ' + pendingTopicID);
        
        //case 1: if the selected is same as pending topic, take him to the training
        //if(pendingTopicID == _topicID){
            $.mobile.changePage( "training.html" );
        //}
        
        
    }
    else{
        $('#sessionPopup').popup('open');
    }
}      

function sessionPick(){
    //alert("session ok");return;
    
    var selection = $("input[name='session-choice']:checked").val();
    
    if(selection == 'individual'){
        _sessionType = 1;
        globalObj.loginMode = 'training';
        $.mobile.changePage( "login.html" );
    }
    else if(selection == 'group'){
        //_sessionType = 2;
        $.mobile.changePage( "group.html");
    }
}               

function getUserPendingSession(){
    var query = "SELECT * FROM cthx_training_session s JOIN  cthx_training t WHERE worker_id=" + _loggedInUserID +
                            " AND s.training_id="+_topicID + " AND t.training_id="+_topicID + 
                            " AND status=1"; 
    console.log('select query: ' + query);
    
    // puts the resultset in _resultSet, you can now use the pubic var in ur method
    DAO.selectQuery(query);
}// end getUserPendingTopic
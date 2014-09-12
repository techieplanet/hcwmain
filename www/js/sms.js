/*
 * status 0 - not sent, 1 - sent not delivered (resend), 2 - delivered
 * priority 1 - high, 2 - average
 * source 1 - user data, 2 - training, 3 - test
 */

function queueTrainingSMS(tx,id){
    //Training activity - status,stype,mtype,moduleid,workerid,trainingid,facid. 
    //Long Sample: 2,1,1,123,123,123,123
    
    var fields = 'message,status,priority,source';
    var query = 'SELECT * FROM cthx_training_session trs JOIN cthx_settings s WHERE trs.session_id = ' + id + 
                ' AND s.id=1';
    tx.executeSql(query,[],function(tx,result){
        if(result.rows.length>0){
            var row = result.rows.item(0);
            console.log('message row: ' + JSON.stringify(row))
            var sObj = JSON.parse(row['jsontext']);
            var message = row['status'] + ',' + row['session_type'] + ',' + row['material_type'] + ',' +
                          row['module_id'] + ',' + row['training_id'] + ',' + 
                          row['worker_id'] + ',' + sObj['facilityID'];
            
            //use prepared statement here to be able to input the message which already contains ocmmas
            var insertQuery = 'INSERT INTO cthx_sms_queue (' + fields + ') VALUES (?,?,?,?)';
            console.log('message: ' + message);
            tx.executeSql(insertQuery, [message,"0","2","2"]);
            
            //try to send out messages in case this is the 6th message
            setTimeout(pushSMSQueue(),1000); 
        }
    });
}



function queueTestSMS(tx,id){    
    //Test result - score, total,testid, workerid, facid
    //Long Sample: 10,10,123,123,123
    
    var fields = 'message,status,priority,source';
    var query = 'SELECT * FROM cthx_test_session tes JOIN cthx_settings s WHERE tes.session_id = ' + id + 
                ' AND s.id=1';
    tx.executeSql(query,[],function(tx,result){
        if(result.rows.length>0){
            var row = result.rows.item(0);
            console.log('message row: ' + JSON.stringify(row))
            var sObj = JSON.parse(row['jsontext']);
            var message = row['score'] + ',' + row['total'] + ',' + row['test_id'] + ',' +
                          row['worker_id'] + ',' + sObj['facilityID'];
            
            //use prepared statement here to be able to input the message which already contains ocmmas
            var insertQuery = 'INSERT INTO cthx_sms_queue (' + fields + ') VALUES (?,?,?)';
            console.log('message: ' + message);
            tx.executeSql(insertQuery, [message,"0","2","3"]);
            
            //try to send out messages in case this is the 6th message
            setTimeout(pushSMSQueue(),1000); 
        }
    });
}


function queueRegSMS(tx,id){
    //User data - worker_id, title, username,password, firstname, middlename, lastname, gender, email, phone, supervisor, cadre_id, facility_id
    //Sample: 123,1234567890,1234567890,123456789012,123456789012,123456789012,1,+50,12345678901,1,1,123
    var fields = 'message,status,priority,source';
    var query = 'SELECT * FROM cthx_health_worker w JOIN cthx_settings s WHERE w.worker_id = ' + id + 
                ' AND s.id=1';
       console.log('queueRegSMS: ' + query)
    tx.executeSql(query,[],function(tx,result){
        if(result.rows.length>0){
            var row = result.rows.item(0);
            console.log('message row: ' + JSON.stringify(row))
            var sObj = JSON.parse(row['jsontext']);
            var genderID = row['gender']=='Male'?'1':'2';
            var message = row['firstname'] + ',' + row['middlename'] + ',' + row['lastname'] + ',' + 
                          genderID + ',' + row['email'] + ',' + row['phone'] + ',' + row['supervisor'] + ',' + 
                          row['cadre_id'] + ',' + row['worker_id'] + ',' + sObj['facilityID'];
            
            //use prepared statement here to be able to input the message which already contains ocmmas
            var insertQuery = 'INSERT INTO cthx_sms_queue (' + fields + ') VALUES (?,?,?,?)';
             console.log('message: ' + message);
             //message,status,priority,source
            tx.executeSql(insertQuery, [message,"0","1","1"]);
            
            //try to send out messages in case this is the 6th message
            setTimeout(pushSMSQueue(),1000); 
        }
    });
}


/*
 * This method pushes the message for sending via HTTP. 
 * If HTTP fails, then try sending via SMPP.
 */
 /*
  * status 0 - not sent, 1 - sent not delivered (resend), 2 - delivered
  *The two queries below should have status=1 until a delivery confirmation is sent back to the app
  * but for demo purposes we are setting to 2 pending when delivery is gotten from Shortcode system and 
  * delivery information is sent back from web app.
  * 
  *  query = 'UPDATE cthx_sms_queue SET status=2,date_sent=\'' + date_sent + '\' WHERE sms_id IN (' + syncMessageIdList + ')';
  *  query = 'UPDATE cthx_sms_queue SET status=2,date_sent=\'' + date_sent + '\' WHERE sms_id =' + row['sms_id'];
  */
function pushSMSQueue(){
    //status 0 - not sent, 1 - sent not delivered (resend), 2 - delivered
    
        var len =1, limit = 6;
        var query = 'SELECT * FROM cthx_sms_queue WHERE status < 2';
        var syncBigMessage = '', syncMessageIdList = '', date_sent='';
        
        globalObj.db.transaction(function(tx){
            tx.executeSql(query,[],function(tx,result){
                var len = result.rows.length;
                console.log('queue length: ' + len)
                if(len>=limit){
                    //then we need to send messages. 
                    //First, we batch all the messages in the queue
                    var bigMessage = '', messageIdList='', averagePrioritycount=0 ;
                    for(var i=0; i<len; i++){
                        (function(i){
                            var row = result.rows.item(i);
                            
                            setTimeout(function(){
                                if(row['priority']==1){  //high priority
                                    //console.log('modulo is 0001');
                                    syncBigMessage = row['message'] + ',' + row['sms_id'];
                                    date_sent = getNowDate();
                                    console.log('message 0001: ' + syncBigMessage + ' date: ' + date_sent);
                                    
                                    //batch update of fields to status 2 - sent
                                    globalObj.db.transaction(function(tx){
                                        query = 'UPDATE cthx_sms_queue SET status=1,date_sent=\'' + date_sent + '\' WHERE sms_id =' + row['sms_id'];
                                        tx.executeSql(query);
                                        
                                        sendHTTPMessage(syncBigMessage)
                                    });
                                }
                                else if(row['priority']==2){    //average priority
                                    //concatenate the message
                                    bigMessage += row['message'] + ',' + row['sms_id'];
                                    messageIdList += row['sms_id'];
                                    averagePrioritycount++; //increment count to use in modulo calculation 
                                    
                                    console.log('i: ' + i + ' bigMessage: ' + bigMessage + ' messageidlist: ' + messageIdList);
                                    console.log('modulo: ' + (averagePrioritycount%limit));
                                    
                                    if( (averagePrioritycount % limit) != 0) {
                                        bigMessage += '|'; 
                                        messageIdList += ',';
                                    }
                                    else {
                                        console.log('modulo is 000');
                                        //get the variables into temp vars that will be used in async mode in transaction statement
                                        var syncBigMessage = bigMessage;
                                        var syncMessageIdList = messageIdList;
                                        bigMessage = ''; messageIdList='' ;
                                        var date_sent = getNowDate();
                                        console.log('messageIdList: ' + syncMessageIdList + 'date: ' + date_sent);

                                        //batch update of fields to status 1 - sent
                                        globalObj.db.transaction(function(tx){
                                            query = 'UPDATE cthx_sms_queue SET status=1,date_sent=\'' + date_sent + '\' WHERE sms_id IN (' + syncMessageIdList + ')';
                                            console.log('date_sent query: ' + query);
                                            tx.executeSql(query);
                                            
                                            sendHTTPMessage(syncBigMessage)
                                        });
                                    }
                                }
                            },1000);
                        })(i);
                    }
                }
            });
        });
}


/*
 * Used to send SMPP message when NO wifi OR mobile carrier data service available
 * Ensure that 
 */
function sendSMPPMessage(message){
    //alert('sending: '+ message);
    console.log('sending SMPP SMS: '+ message + ' message length: ' + message.length);
    //return;
    var query = 'SELECT * FROM cthx_settings WHERE id=1';
    globalObj.db.transaction(function(tx){
        tx.executeSql(query,[],function(tx,result){
            var row = result.rows.item(0);
            var sObj = JSON.parse(row['jsontext']);
            //var number = '08038445144'; //$("#numberTxt").val();
            var shortcode = sObj.shortcode;
            //var message = 'Testing from mobile'; //$("#messageTxt").val();
            //var intent = "INTENT"; //leave empty for sending sms using //default intent
            var intent = ""; //leave empty for sending sms using //default intent
            var success = function () { 
                //alert('Usage SMS sent successfully'); 
            };
            var error = function (e) { 
                //alert('Usage SMS Sending Failed: ' + e); 
            };
            sms.send(shortcode, message, intent, success, error);
        })
    });
}

/*
 * Used to send message when wifi OR mobile carrier data service available
 */
function sendHTTPMessage(message){
    //status 0 - not sent, 1 - sent not delivered (resend), 2 - delivered
    
    $.ajax({
        url: 'http://techieplanetltd.com/chai/messagehelper.php',
        type: "POST",
        data: {message:message},
        success: function(response){
                    console.log('sending HTTP SMS: '+ message + ' message length: ' + message.length);
                    //console.log('HTTP response: ' + response);
                    responseObj = JSON.parse(response);
      
                    var smsIDList = '';
                    for(key in responseObj){
                        console.log('responseObj[key]: ' + responseObj[key]);
                        console.log('responseObj[key]["status"]: ' + responseObj[key]['status']);
                        if(responseObj[key]['status']==2)
                            smsIDList += responseObj[key]['smsid'] + ',';
                    }
                    smsIDList = smsIDList.substr(0, smsIDList.length-1);
                    console.log('smsIDList: ' + smsIDList);
        
                    var updateSuccess = function () { console.log('Usage Data sent successfully'); };
                    var updateError = function (e) { console.log('Usage Data Sending Failed: ' + e); };
                    globalObj.db.transaction(function(tx){
                        tx.executeSql('UPDATE cthx_sms_queue SET status=2 where sms_id IN (' + smsIDList + ')');
                    },updateError,updateSuccess)
        },
        error: function(jqXHR, textStatus, errorThrown){
            //console.log('jqXHR: ' + JSON.stringify(jqXHR));
            //console.log('textStatus: ' + textStatus);
            //console.log('errorThrown: ' + errorThrown);
            
            var jqXHRObj = jqXHR;
            if(jqXHRObj['readyState']==0 && jqXHRObj['responseText']=="" && textStatus=="error"){
                //no internet connection, use SMS
                sendSMPPMessage(message);
            }
        }
    
    });
}
$(document ).delegate("#questionpage", "pagebeforecreate", function() {
    createHeader('questionpage','Assessment');
    createFooter('questionpage');
    setNotificationCounts();
});

$(document ).delegate("#questionpage", "pageshow", function() {
    setHeaderNotificationCount('questionpage');
});

/*
 *  1. Fetches the test questions from database based on topic id selected
 *  2. Stores details of test session into database
 *  3. Define next and previous buttons where needed
 *  4. Displays title of assessment
 */

 $(document ).delegate("#questionpage", "pageinit", function() {    
     //openDb();
     //globalObj.testID = 1;
     //console.log('question pageinit: ' + $(this).data("url"));
     
     //1. get all the quesion ids for the topic selected into an array, 
     //2. shuffle the array elements
     //3. set resulting first element to question id to display
        globalObj.db.transaction(function(tx){
                           //var query = 'SELECT question_id FROM cthx_test_question WHERE test_id=' + globalObj.testID;
                           var query = 'SELECT * FROM cthx_test t LEFT JOIN cthx_test_question q ON ' +
                                       'q.test_id=t.test_id WHERE t.test_id=' + globalObj.testID;
                        tx.executeSql(query,[],
                                      function(tx,resultSet){
                                          var len = resultSet.rows.length;
                                          if(len>0){
                                              //put all questions ids in array that can be shuffled so questions can be displayed randomly
                                              globalObj.questionIDList = new Array();
                                              for(var i=0; i<len; i++){
                                                    globalObj.questionIDList[i] = resultSet.rows.item(i)['question_id'];
                                              }
                                              
                                              //shuffle array
                                              shuffle(globalObj.questionIDList);
                                              
                                              //display the test title 
                                              globalObj.testTitle = resultSet.rows.item(0)['title'];
                                              $('.c-title').html(globalObj.testTitle)

                                              //display first question 
                                              loadQuestion(0); //load full details for id at index 0
                                              
                                              console.log('the id list: ' + JSON.stringify(globalObj.questionIDList));
                                              
                                          }
                                      },
                                      function(error){alert('Error getting IDs')} //errorCB
                        );
                    }
            );
     
 });//end pageinit
 
 
 
 //mimics the pageinit delegate function as if the page is loading over again
function loadQuestion(quest_index){
//    $('#vsPopup').popup('open');
    globalObj.questionID = globalObj.questionIDList[quest_index];
    console.log('loadTest - testID: ' + globalObj.testID + ', question id: ' + globalObj.questionID);
    
    globalObj.db.transaction(fetchQuestion,
                    function(error){alert('Error loading question')}, //errorCB
                    function(){  //succesCB
                            //set next and previous id for question nav buttons
                            setUpQuestionNavigator(quest_index);
                        }  
            );
                
     $('#tipPopup').popup('close');
}
 
 
 /*
 * This method fetches the test question for the selected topic from the database
 */
 function fetchQuestion(tx){
     console.log('fetchFirstQuestion test ID: '+ globalObj.testID)
     var query = globalObj.questionID > 0 ?
                 'SELECT * FROM cthx_test_question WHERE question_id='+globalObj.questionID :
                 'SELECT * FROM cthx_test_question WHERE test_id='+globalObj.testID + ' ORDER BY question_id LIMIT 1';
      
      //$('#qsPopup').popup('open');
      //setTimeout($('#qsPopup').popup('close'),7000);
      
     tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    if(resultSet.rows.length > 0){
                        var row = resultSet.rows.item(0);
                        globalObj.questionID = row['question_id'];
                                               
                        //update the user interface with the question details
                        setUpQuestion(row);
                        
                        
                    }
                    else
                        $('div[data-role="content"]').html('No questions for this test');
                },
                function(error){
                    console.log('Error in handleTopicVideo');
                }
        );
 }//end fetch
 
 
  
//extracts the question details from the row argument sent and updates the UI
function setUpQuestion(questionRow){
        //console.log('question row: ' + JSON.stringify(questionRow));
        
        
        $('#question li:first-child').html(questionRow["question"]);        
        var html="";
        
        //get the options shuffled 
        var optionsArray = shuffleOptions(questionRow['options']);
        console.log('optionsArray: ' + JSON.stringify(optionsArray));
        
//        <input class="" type="radio" name="session-choice" id="optiona" value="optiona" data-iconpos="right"  />
//        <label class="" data-role="button" data-corners="false" for="optiona"><span class="question-opt" ></span>Referring a Sick Baby</label>
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-A" value="A" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-A" data-corners="false"><span class="question-opt" >A</span><span id="optiontext">' + optionsArray[0] + '</span></label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-B" value="B" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-B" data-corners="false"><span class="question-opt" >B</span><span id="optiontext">' + optionsArray[1] + '</span></label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-C" value="C" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-C" data-corners="false"><span class="question-opt" >C</span><span id="optiontext">' + optionsArray[2] + '</span></label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-D" value="D" data-iconpos="right"  />';
        html +=     '<label for="radio-choice-D" data-corners="false"><span class="question-opt" >D</span><span id="optiontext">' + optionsArray[3] + '</span></label>';
       
       //set the answer text box 
       $('#answer').val(questionRow['correct_option']);
       
       //set the tip text
       console.log('text: ' + questionRow['tiptext']);
       $('#tipcontent').html(questionRow['tiptext']);
       
        $("#options").html(html);
        $("#question").css('display','block');
        //$("#nextprev").css('display','block');
        $("#questionpage").trigger("create");
}


 //creates a navigation bar for the questions
function setUpQuestionNavigator(currentIndex){
    var listLength = globalObj.questionIDList.length;
    if(currentIndex < listLength-1){
        //console.log('inside comparison 2 currentID < lastID')
        $('#nextQuestion').attr('onclick','showTip('+ (currentIndex+1) + ')');
        //$('#nextQuestion').removeClass('hidden');
    }
    if(currentIndex==listLength-1){
        $('#nextQuestion').addClass('hidden');
        $('#test-done').attr('onclick','showTip('+ (currentIndex+1) + ')');
        $('#test-done').removeClass('hidden');
    }
    
    //question count display
    $('#question_number').html('Question ' + (currentIndex+1) + '/' + listLength);
    
}//end navigator
 
 
/*
 * retrieves the selected text and compares with the correct answer kept in the hidden answer box.
 * string comparison has to be done here since the answer is kept as text in db to make 
 * randomization of options display feasible
 */
function showTip(quest_ID){
    var selectedOptionID = $('input[name="radio-choice"]:checked').attr('id');
    if(selectedOptionID=='' || selectedOptionID==null){
        $('#selectionPopup').popup('open');
        return;
    }
        
    var selectedOptionText = $('label[for="'+ selectedOptionID + '"] span#optiontext').html();
    var answer = $('#answer').val();
    console.log('selectedOptionID: ' + selectedOptionID + ', selectedOptionText: ' + selectedOptionText + ', Answer: ' + answer);
    
    
    if(selectedOptionText == answer){  //correct answer
        $('#status').html('CORRECT');
        
        //increment score count
        var prevcount = $('#scorecount').val();
        if(prevcount=='' || prevcount==null)
            $('#scorecount').val(1);
        else
            $('#scorecount').val(parseInt(prevcount) + 1);
    }
    else {
         $('#status').html('WRONG');
    }
     
    console.log('quest id: ' + quest_ID + ' qList: ' + globalObj.questionIDList);
    
    var listLength = globalObj.questionIDList.length;
    //pop the tip and move to next question when ok button on tip is clicked 
    if(quest_ID < listLength){
        $('#tipseen').attr('onclick','loadQuestion('+ quest_ID + ')');
        $('#tipPopup').popup('open');
    }
    else if(quest_ID == listLength){
        var sc = $('#scorecount').val();
        $('#tipseen').attr('onclick','changeToCert('+sc + ','+ listLength + ')');
        $('#tipPopup').popup('open');
    }
    
    
        
}




/*
 * Save the session and change to certificate page
 */
function changeToCert(scorecount, total){
   //save test session first
   globalObj.db.transaction(saveTestSession,function(error){'Error saving test session'});
   
   //change to cert page
   globalObj.testScore = scorecount;
   globalObj.testTotal = total;
   $.mobile.changePage('test.html?pageMode=2');
}


//records the test session to database
function saveTestSession(tx){
        //alert('recording session...' + sessionUsersList[0])
        
        var fields = '"date_taken","score","total","test_id","worker_id"';
        var values = '"' + getNowDate() + '",' + //date taken
                  '"' + parseInt($('#scorecount').val()) + '",' +   //score
                  '"' + globalObj.questionIDList.length + '",' +  //total number of questions in test
                  '"' + globalObj.testID  + '",' + //test id
                  '"' + globalObj.loggedInUserID + '"';    //logged in user id - test taker
        
        DAO.save(tx, 'cthx_test_session', fields, values);      
        
        
        //queue last inserted row for SMS sending 
        //set time out 500 to wait for the update to complete
        setTimeout(function(){
            var query = 'SELECT session_id FROM cthx_test_session ORDER BY session_id DESC LIMIT 1';
            globalObj.db.transaction(function(tx){
                tx.executeSql(query,[],function(tx,result){
                    if(result.rows.length>0){
                        var row = result.rows.item(0);
                        queueTestSMS(tx, row['session_id']);   
                    }
                });
            });
        },500);
}
  
  
  
 function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleOptions(optionsJSON){
    var optionsObj = JSON.parse(optionsJSON);
    var optionsArray= new Array();
    
   optionsArray[0] = optionsObj["A"];
   optionsArray[1] = optionsObj["B"];
   optionsArray[2] = optionsObj["C"];
   optionsArray[3] = optionsObj["D"];
   
   var shuffledOptions = shuffle(optionsArray);
   return shuffledOptions;
}
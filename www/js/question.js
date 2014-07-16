
/*
 *  Initializes the training page
 *  1. Fetches the test questions from database based on topic id selected
 *  2. Stores details of test session into database
 *  3. Define next and previous buttons where needed
 *  4. Displays title of assessment
 */
var questionIDList;
 $(document ).delegate("#questionpage", "pageinit", function() {      
     //console.log('question pageinit: ' + $(this).data("url"));
     
     //1. get all the quesion ids for the topic selected into an array, 
     //2. shuffle the array elements
     //3. set resulting first element to question id to display 
        _db.transaction(function(tx){
                        tx.executeSql('SELECT question_id FROM cthx_test_question WHERE test_id=' + _testID,[],
                                      function(tx,resultSet){
                                          var len = resultSet.rows.length;
                                          if(len>0){
                                              questionIDList = new Array();
                                              for(var i=0; i<len; i++){
                                                    questionIDList[i] = resultSet.rows.item(i)['question_id'];
                                              }
                                              
                                              //shuffle array
                                              shuffle(questionIDList);
                                              
                                              //display first element 
                                              loadQuestion(0); //load full details for id at index 0
                                              
                                              console.log('the id list: ' + JSON.stringify(questionIDList));
                                              
                                          }
                                      },
                                      function(error){alert('Error getting IDs')} //errorCB
                        );
                    }
            );
     
     //this transaction is meant to get the title of the test displayed at top of page
     _db.transaction(function(tx){
                        tx.executeSql('SELECT title FROM cthx_test WHERE test_id=' + _testID,[],
                                      function(tx,resultSet){
                                          if(resultSet.rows.length>0){
                                              globalObj.testTitle = resultSet.rows.item(0)['title'];
                                              $('#test_title').html(globalObj.testTitle + ' Assessment')
                                          }
                                      },
                                      function(error){alert('Error setting title')} //errorCB
                        );
                    }
            );
     
 });//end pageinit
 
 
 /*
 * This method fetches the test question for the selected topic from the database
 */
 function fetchQuestion(tx){
     console.log('fetchFirstQuestion: '+ _testID)
     var query = _questionID > 0 ?
                 'SELECT * FROM cthx_test_question WHERE question_id='+_questionID :
                 'SELECT * FROM cthx_test_question WHERE test_id='+_testID + ' ORDER BY question_id LIMIT 1';
      
      //$('#qsPopup').popup('open');
      //setTimeout($('#qsPopup').popup('close'),7000);
      
     tx.executeSql(query,[],
                function(tx,resultSet){  //query success callback
                    if(resultSet.rows.length > 0){
                        var row = resultSet.rows.item(0);
                        _questionID = row['question_id'];
                                               
                        //update the user interface with the question details
                        getQuestion(row);
                        
                        
                    }
                    else
                        $('div[data-role="content"]').html('No questions for this test');
                },
                function(error){
                    console.log('Error in handleTopicVideo');
                }
        );
 }//end getvideo file
 
 
 
//extracts the question details from the row sent and updates the UI
function getQuestion(questionRow){
        //console.log('question row: ' + JSON.stringify(questionRow));
        
        
        $('#question li').html(questionRow["question"]);        
        var html="";
        
        //get the options shuffled 
        var optionsArray = shuffleOptions(questionRow['options']);
        console.log('optionsArray: ' + JSON.stringify(optionsArray));
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-A" value="A" />';
        html +=     '<label for="radio-choice-A">' + optionsArray[0] + '</label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-B" value="B" />';
        html +=     '<label for="radio-choice-B">' + optionsArray[1] + '</label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-C" value="C" />';
        html +=     '<label for="radio-choice-C">' + optionsArray[2] + '</label>';
        
        html +=     '<input type="radio" name="radio-choice" id="radio-choice-D" value="D" />';
        html +=     '<label for="radio-choice-D">' + optionsArray[3] + '</label>';
       
       //set the answer text box 
       $('#answer').val(questionRow['correct_option']);
       
       //set the tip text
       $('#tipcontent').html(questionRow['tiptext']);
       
        $("#options").html(html);
        $("#question").css('display','block');
        $("#nextprev").css('display','block');
        $("#questionpage").trigger("create");
}



//creates a navigation bar for the questions
function setUpQuestionNavigator(currentIndex){
    if(currentIndex < questionIDList.length-1){
        //console.log('inside comparison 2 currentID < lastID')
        $('#nextQuestion').attr('onclick','showTip('+ (currentIndex+1) + ')');
        $('#nextQuestion').removeClass('hidden');
    }
    if(currentIndex==questionIDList.length-1){
        $('#nextQuestion').addClass('hidden');
        $('#test-done').attr('onclick','showTip('+ (currentIndex+1) + ')');
        $('#test-done').removeClass('hidden');
    }
    
    //question count display
    $('#question_number').html('Question ' + (currentIndex+1) + '/' + questionIDList.length);
    
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
        
    var selectedOptionText = $('label[for="'+ selectedOptionID + '"] span.ui-btn-text').html();
    var answer = $('#answer').val();
    console.log('selectedOptionID: ' + selectedOptionID + ', selectedOptionText: ' + selectedOptionText + ', Answer: ' + answer);
    
    
    if(selectedOptionText == answer){  //correct answer
        $('#correct').removeClass('hidden');
        $('#wrong').addClass('hidden');
        
        //increment score count
        var prevcount = $('#scorecount').val();
        if(prevcount=='' || prevcount==null)
            $('#scorecount').val(1);
        else
            $('#scorecount').val(parseInt(prevcount) + 1);
    }
    else {
         $('#wrong').removeClass('hidden');
         $('#correct').addClass('hidden');
    }
     
    console.log('quest id: ' + quest_ID + ' qList: ' + questionIDList);
    
    //pop the tip and move to next question when ok button on tip is clicked 
    if(quest_ID < questionIDList.length){
        $('#tipseen').attr('onclick','loadQuestion('+ quest_ID + ')');
        $('#tipPopup').popup('open');
    }
    if(quest_ID == questionIDList.length){
        var sc = $('#scorecount').val();
        $('#tipseen').attr('onclick','changeToCert('+sc + ','+ questionIDList.length + ')');
        $('#tipPopup').popup('open');
    }
    
    
        
}


/*
 * Save the session and change to certificate page
 */
function changeToCert(scorecount, total){
   //save session 
   _db.transaction(saveTestSession,function(error){'Error saving test session'});
   
   //change to cert page
   globalObj.testScore = scorecount;
   globalObj.testTotal = total;
   $.mobile.changePage('certificate.html');
}


//mimics the pageinit delegate function as if the page is loading over again
function loadQuestion(quest_index){
//    $('#vsPopup').popup('open');
    _questionID = questionIDList[quest_index];
    console.log('loadTest - testID: ' + _testID + ', question id: ' + _questionID);
    
    _db.transaction(fetchQuestion,
                    function(error){alert('Error loading question')}, //errorCB
                    function(){  //succesCB
                            //set next and previous id for question nav buttons
                            setUpQuestionNavigator(quest_index);
                        }  
            );
                
     $('#tipPopup').popup('close');
}




//records the test session to database
function saveTestSession(tx){
        //alert('recording session...' + sessionUsersList[0])
        
        var fields = '"date_taken","score","total","test_id","worker_id"';
        var values = '"' + getNowDate() + '",' + //date taken
                  '"' + parseInt($('#scorecount').val()) + '",' +   //score
                  '"' + questionIDList.length + '",' +  //total number of questions in test
                  '"' + _testID  + '",' + //test id
                  '"' + _loggedInUserID + '"';    //logged in user id - test taker
        
        DAO.save(tx, 'cthx_test_session', fields, values);      
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
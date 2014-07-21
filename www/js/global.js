
var globalObj = {   //begin class
  /*
   *    GENERAL
   */
    appName : 'HCW LMS',
    
    loginMode : '',
    
    sessionType: 0,  //sessionType: 1 - INDIVIDUAL SESSION, 2 - GROUP SESSION, 3 - TEST SESSION

    db : '',   //database object
    
    categoryID : 0, //current category id, init 0
    
    moduleID : 0, //current module id, init 0
    moduleTitle: '',
    
    topicID : 0,  //current topic id, init 0
        
    loggedInUserID : -1, //init -1, 0 reserved for group sessions
    
    sessionUsersList : [], //list of logged in users. super useful for group sessions
    
    
    /*
     *  SETUP
     */
    videoDir : 'CHAI/Videos', //video default directory on device
    
    
   
  
  /*
   *    TRAINING/VIDEO
   */
    videoPlaying : false,
    videoEnded : false,
    videoPlayedList : new Array(),
    videoFile : '', 
    
  /*
   * TEST/ASSESSMENT VARS
   */
  testScore : 0,
  testTotal: 0,
  testTitle: '',
  testID : 0,
  questionID: 0  
  //testQuestionIDList:new Array()
  
  
}// end class
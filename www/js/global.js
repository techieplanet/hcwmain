
var globalObj = {   //begin class
  /*
   *    GENERAL
   */
    appName : 'HCW LMS',
    
    loginMode : '',
    
    sessionType: 0,  //sessionType: 1 - INDIVIDUAL SESSION, 2 - GROUP SESSION, 3 - TEST SESSION
    
    videoMaterial: 1,
    guideMaterial: 2,  
    guideViewed: false,

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
    videoDir : 'HCW/Videos', //video default directory on device
    guidesDir : 'HCW/Guides', //guides default directory on device
    jobaidsDir : 'HCW/JobAids', //job aids default directory on device
    helpDir : 'HCW/Help', //help default directory on device
    
   
  
  /*
   *    TRAINING VIDEO, GUIDE, FAQ
   */
    videoPlaying : false,
    videoEnded : false,
    videoPlayedList : new Array(),
    videoFile : '', 
    guideFile : '',
    
    
  /*
   * TEST/ASSESSMENT VARS
   */
  testScore : 0,
  testTotal: 0,
  testTitle: '',
  testID : 0,
  questionID: 0,  
  questionIDList:new Array()
  
  
}// end class
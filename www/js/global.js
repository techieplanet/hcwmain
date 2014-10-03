
var globalObj = {   //begin class
  /*
   *    GENERAL
   */
    appName : 'mTrain',
    
    loginMode : '', //whether the user logged in through test, training, profile or admin
    
    usersCount : 0, //stores the number of users in the system
    
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
    
    retakeMode : false,     //determines if trainig landing page is in retake mode
    
    sandboxMode : false,    //puts the systm in user sandbox mode
    
    firstTimeUse : true,    //remains true until otherwise proven not so
    
    currentPage : '',       //the id attribute of the current page
    
    /*
     *  SETUP
     */
    videoDir : 'MTRAIN/Videos', //video default directory on device
    guidesDir : 'MTRAIN/Guides', //guides default directory on device
    jobaidsDir : 'MTRAIN/JobAids', //job aids default directory on device
    helpDir : 'MTRAIN/Help', //help default directory on device

    profileStatDetailsView : false,
  
  /*
   *    TRAINING VIDEO, GUIDE, FAQ
   */
    videoPlaying : false,
    videoEnded : false,
    videoPlayedList : new Array(),
    videoFile : '', 
    guideFile : '',
    //justFinishedTraining : false,
    
    
  /*
   * TEST/ASSESSMENT VARS
   */
  testScore : 0,
  testTotal: 0,
  testTitle: '',
  testID : 0,
  questionID: 0,  
  questionIDList:new Array(),
  
  
  //NOTIFICATIONS
  waitingTests : 0,
  uncompletedTrainings : 0,
  failedTests : 0,
  totalNotificationCount : 0,
  
  //FACILITY 
  supervisorID : 0,
  
  secret_questions : ['','What is your favorite colour?','What city were you born?','What is your favorite food?']
  
  
}// end class


var workerObj = {   //begin class
    
    workerID : 0,
    firstname : '',
    middlename : '',
    lastname : '',
    gender : '',
    email : '',
    phone : '',
    //qualification : '',
    supervisor : 0,
    cadreID : 0,
    
    username : '',
    password: '',
    
    secret_question : 0,
    secret_answer : ''
    
   
}// end class

var adminObj = {   //begin class
    
    adminID : '',
    firstname : '',
    middlename : '',
    lastname : '',
    gender : '',
    email : '',
    phone : '',
    //qualification : '',
    supervisor : 0,
    cadreID : 0,
    
    username : '',
    password: ''
    
   
}// end class


var settingsObj = {   //begin class 
    smscount : 0,
    shortcode : 0,
    facilityID : 0,
    facilityAddrLine1 : '',
    facilityAddrLine2 : '',
    facilityName : ''
}// end class
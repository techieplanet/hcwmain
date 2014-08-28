/*
 * THIS FILE IS MEANT TO POPULATE/SETUP THE DB TABLES FOR A FRESH DEMO INSTALLATION OF THE APP
 * THE DATA HERE ARE FOR DEMO PURPOSES ONLY. 
 * EACH METHOD CALL IN THE POPULATE() METHOD SETS UP A TABLE
 */

           
function openDb(){
    //alert("inside opendb")
    //create database or open it if created
    globalObj.db = window.openDatabase("chaidbpx", "1.0", "mTrapp DB", 200000); 
    globalObj.db.transaction(populateDB, errorCB, successCB);                           
}
            
function populateDB(tx){
    //alert("inside populatedb")
       setUpCategoryTable(tx);
       setUpTrainingModules(tx);
       setUpTopics(tx);
       setUpTrainingToModules(tx)
       setUpCadre(tx);
       setUpWorkers(tx);
       setUpTrainingSession(tx);
       setUpTests(tx);
       setUpTestQuestions(tx);
       setUpTestSession(tx);
       setUpCounters(tx);
       setUpJobAids(tx);
       setUpAidsToModules(tx);
       setUpFAQ(tx);
       setUpFAQToModules(tx);
       setUpUserGuides(tx);
       setUpBasicSettings(tx);
       setSMSQueue(tx);
       deleteUsageView(tx);
       
}
            
function successCB(){
    //$('#result').html('Successfully populated db tables')
    //alert('Successfully populated db tables')
}
            
function errorCB(error){
    //$('#result').html('Error populating db tables: ' + JSON.stringify(error));
    alert('Error populating db tables: ' + JSON.stringify(error));
}


function setUpCategoryTable(tx){
    //alert("inside setpcat")
    tx.executeSql('DROP TABLE IF EXISTS cthx_category');
    tx.executeSql('CREATE TABLE IF NOT EXISTS cthx_category (category_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,category_name TEXT, description TEXT);');
    tx.executeSql('INSERT INTO cthx_category(category_name,description) VALUES ("Emergency Obstetric Care", "This is about infant health")');
    tx.executeSql('INSERT INTO cthx_category(category_name,description) VALUES ("Family Health Planning", "This is about keeping your family healthy. Yes, healthy.")');
}

function setUpTrainingModules(tx){
    //alert('inside setmodules');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_module');
    tx.executeSql('CREATE TABLE cthx_training_module (module_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, module_title TEXT, guide_file TEXT, remarks TEXT, admin_id INTEGER, category_id INTEGER)');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Antenatal Care Series", "chai_reqs.pdf","this is the module for antenatal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Postnatal Care Series","chai_sample.pdf", "this is module about post natal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Introduction to Family Planning Education","","this is module on family planning","12","2")');
    
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Postnatal Care Series 2","","this is module about post natal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Advanced Family Planning Education","","this is module on family planning","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Family Planning Benefits","","this is module on family planning","12","1")');   
}


function setUpTopics(tx){
    //alert('inside settopics');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training');
    tx.executeSql('CREATE TABLE cthx_training (training_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, training_title TEXT, video_file TEXT)');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Referring A Sick Baby","refer_sick_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("The Cold Baby","cold_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Breathing Problems","breathing_problems.mp4")');
  
    //module2 topics
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Breathing Problems 2","breathing_problems.mp4")' );
}


function setUpTrainingToModules(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_to_module');
    tx.executeSql('CREATE TABLE "cthx_training_to_module" ("module_id" INTEGER NOT NULL, "training_id" INTEGER NOT NULL, PRIMARY KEY ("module_id", "training_id"))');
    
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,1)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,2)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,3)');
    
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,4)');
}


function setUpWorkers(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_health_worker');
    tx.executeSql('CREATE TABLE "cthx_health_worker" ("worker_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "username" TEXT, "password" TEXT, "firstname" TEXT, "middlename" TEXT, "lastname" TEXT, "gender" TEXT, "email" TEXT, "phone" TEXT, "qualification" TEXT, "supervisor" INTEGER, "cadre_id" INTEGER,"secret_question" TEXT,"secret_answer" TEXT)');
    var query = 'INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","qualification","supervisor","cadre_id","secret_question","secret_answer") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    
    //tx.executeSql(query,["1","Mr","chappy","chappy","Fapman","mapman","lapman","male","chapman@fmail.com","1234567890","B.Sc","1","1","1","Blue"]);
    //tx.executeSql(query,["2","mr","wally","wally","wally","wally","wally","male","wally@gmail.com","1234567890","B.Sc","0","1"]);
    //tx.executeSql(query,["3","miss","katty","katty","katty","katty","katty","male","katty@gmail.com","1234567890","B.Sc","0","1"]);
    
//    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("1","Mr","chappy","chappy","Fapman","mapman","lapman","male","chapman@fmail.com","1234567890","B.Sc","1","1","1")');
//    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("2","mr","wally","wally","wally","wally","wally","male","wally@gmail.com","1234567890","B.Sc","0","1","1")');
//    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("3","miss","katty","katty","katty","katty","katty","male","katty@gmail.com","1234567890","B.Sc","0","1","1")');
}

function setUpCadre(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_cadre');
    tx.executeSql('CREATE TABLE cthx_cadre ("cadre_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "cadre_title" TEXT)');
    tx.executeSql('INSERT INTO cthx_cadre ("cadre_id","cadre_title") VALUES ("1","CHEW")');
    tx.executeSql('INSERT INTO cthx_cadre ("cadre_id","cadre_title") VALUES ("2","Nurse")');
    tx.executeSql('INSERT INTO cthx_cadre ("cadre_id","cadre_title") VALUES ("3","Midwife")');
}

function setUpTrainingSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_session');
    tx.executeSql('CREATE TABLE "cthx_training_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "start_time" DATETIME, "end_time" DATETIME, "status" INTEGER, "session_type" INTEGER, "material_type" INTEGER,"worker_id" INTEGER, "module_id" INTEGER, "training_id" INTEGER);');
    
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("1",NULL,NULL,"2","1","2","1","1","1")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("2","01-01-2014",NULL,"1","1","1","2","2","3")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("3","01-01-2014",NULL,"1","1","1","1","1","2")');
    
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("4","01-01-2014",NULL,"2","1","2","1","2","3")');
}


function setUpTests(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test');
    tx.executeSql('CREATE TABLE "cthx_test" ("test_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "module_id" INTEGER)');
    
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("1","Antenatal Care Test","1")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("2","Postnatal Care Series Test","2")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("3","Postnatal Care Series 2 Test","3")');
}

function setUpTestSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test_session');
    tx.executeSql('CREATE TABLE "cthx_test_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "date_taken" DATETIME, "score" REAL, "total" REAL, "test_id" INTEGER, "worker_id" INTEGER)');
    
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("1",NULL,"1","4","1","1")');
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("2",NULL,"1","4","2","1")');
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("3",NULL,"1","4","1","2")');    
}

function setUpTestQuestions(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test_question');
    tx.executeSql('CREATE TABLE "cthx_test_question" ("question_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "question" TEXT,"options" TEXT, "correct_option" TEXT, "test_id" INTEGER, "tiptext" TEXT)');
    
    var tiptext = 'is the correct answer...';
    var query = 'INSERT INTO "cthx_test_question" ("question","options","correct_option","test_id","tiptext") VALUES (?,?,?,?,?)';
    
    //test 1 questions
    tx.executeSql(query,["What is the capital of Ghana?",'{"A":"Kumasi","B":"Accra","C":"Abuja","D":"Lagos"}',"Accra","1",'Accra '+tiptext]);
    tx.executeSql(query,["What is the capital of Lagos?",'{"A":"Ondo","B":"Osun","C":"Gombe","D":"Ikeja"}',"Ikeja","1",'Ikeja '+tiptext]);
    tx.executeSql(query,["What is the capital of South Africa?",'{"A":"Pretoria","B":"Johanesburg","C":"Sowetto","D":"Cape town"}',"Pretoria","1",'Pretoria '+tiptext]);
    tx.executeSql(query,["What is the capital of England?",'{"A":"Bradford","B":"London","C":"Manchester","D":"Liverpool"}',"London","1",'London '+tiptext]);
    
    //test 2 questions
    tx.executeSql(query,["What is the capital of the U.S.A?",'{"A":"Kumasi","B":"Washington","C":"Abuja","D":"Lagos"}',"Washington","2",'Washington '+tiptext]);
    tx.executeSql(query,["What is the capital of Canada?",'{"A":"Ondo","B":"Ottawa","C":"Gombe","D":"Ikeja"}',"Ottawa","2",'Ottawa '+tiptext]);
    tx.executeSql(query,["What is the capital of Russia?",'{"A":"Pretoria","B":"Moscow","C":"Sowetto","D":"Cape town"}',"Moscow","2",'Moscow '+tiptext]);
    tx.executeSql(query,["What is the capital of Scotland?",'{"A":"Bradford","B":"Edinburgh","C":"Manchester","D":"Liverpool"}',"Edinburgh","2",'Edinburgh '+tiptext]);
}



/*-------------  JOB AID -----------------*/
function setUpCounters(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_counters');
    tx.executeSql('CREATE TABLE "cthx_counters" ("job_aids" INTEGER DEFAULT 0 , "standing_order" INTEGER DEFAULT 0 , "help" INTEGER DEFAULT 0 )');
    tx.executeSql('INSERT INTO "cthx_counters" ("job_aids","standing_order","help") VALUES (0,0,0)');
}

function setUpJobAids(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_jobaid');
    tx.executeSql('CREATE TABLE "cthx_jobaid" ("aid_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"aid_title" TEXT,"aid_file" TEXT)');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("1","Job Aid 1","jobaid1.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("2","Job Aid 2","jobaid2.pdf")');
    tx.executeSql('INSERT INTO "cthx_jobaid" ("aid_id","aid_title","aid_file") VALUES ("3","Job Aid 3","jobaid3.pdf")');
}

function setUpAidsToModules(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_jobaid_to_module');
    tx.executeSql('CREATE TABLE "cthx_jobaid_to_module" ("aid_id" INTEGER NOT NULL, "module_id" INTEGER NOT NULL, PRIMARY KEY ("aid_id", "module_id"))');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("aid_id","module_id") VALUES ("1","1")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("aid_id","module_id") VALUES ("2","1")');
    tx.executeSql('INSERT INTO "cthx_jobaid_to_module" ("aid_id","module_id") VALUES ("3","1")');
}


function setUpFAQ(tx){
    var text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt";
    tx.executeSql('DROP TABLE IF EXISTS cthx_faq');
    tx.executeSql('CREATE TABLE "cthx_faq" ("faq_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "question" TEXT, "answer" TEXT);');
    tx.executeSql('INSERT INTO "cthx_faq" ("faq_id","question","answer") VALUES ("1","What is Medical Health about?","' + text + '")');
    tx.executeSql('INSERT INTO "cthx_faq" ("faq_id","question","answer") VALUES ("2","Where do I get more medical videos?","' + text + '")');
    tx.executeSql('INSERT INTO "cthx_faq" ("faq_id","question","answer") VALUES ("3","How do I use this software to improve my medical skill efficiency?","' + text + '")');
}

function setUpFAQToModules(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_faq_to_module');
    tx.executeSql('CREATE TABLE "cthx_faq_to_module" ("faq_id" INTEGER NOT NULL, "module_id" INTEGER NOT NULL, PRIMARY KEY ("faq_id", "module_id"))');
    tx.executeSql('INSERT INTO "cthx_faq_to_module" ("faq_id","module_id") VALUES ("1","1")');
    tx.executeSql('INSERT INTO "cthx_faq_to_module" ("faq_id","module_id") VALUES ("2","1")');
    tx.executeSql('INSERT INTO "cthx_faq_to_module" ("faq_id","module_id") VALUES ("3","3")');
}

function setUpUserGuides(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_user_guide');
    tx.executeSql('CREATE TABLE "cthx_user_guide" ("guide_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"guide_title" TEXT,"guide_file" TEXT)');
    tx.executeSql('INSERT INTO "cthx_user_guide" ("guide_id","guide_title","guide_file") VALUES ("1","User Guide 1","user_guide1.pdf")');
    tx.executeSql('INSERT INTO "cthx_user_guide" ("guide_id","guide_title","guide_file") VALUES ("2","User Guide 2","user_guide2.pdf")');
    tx.executeSql('INSERT INTO "cthx_user_guide" ("guide_id","guide_title","guide_file") VALUES ("3","User Guide 3","user_guide3.pdf")');
}

function deleteUsageView(tx){
    tx.executeSql('DROP VIEW IF EXISTS cthx_usageview');
}

function setUpBasicSettings(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_settings');
    tx.executeSql('CREATE TABLE IF NOT EXISTS "cthx_settings" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "settings_name" TEXT, "jsontext" TEXT)');
    var query = 'INSERT INTO "cthx_settings" ("id","settings_name","jsontext") VALUES (?,?,?)'
    tx.executeSql(query,["1","Basic Settings",'{"smscount":"","shortcode":"","facilityID":"","facilityName":"","facilityAddrLine1":"","facilityAddrLine2":""}']);
    
    //tx.executeSql(query,["1","Basic Settings",'{"smscount":"22","shortcode":"2","facilityID":"2","facilityName":"XYZ Hopsital","facilityAddrLine1":"Address Line 1","facilityAddrLine2":"Address Line 2"}']);
}

function setSMSQueue(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_sms_queue');
    tx.executeSql('CREATE TABLE IF NOT EXISTS "cthx_sms_queue" ("sms_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "message" TEXT, "status" INTEGER, "priority" INTEGER, "source" INTEGER, "packet_count" INTEGER, "sms_count" INTEGER, "date_sent" DATETIME)');
    
    //var query = 'INSERT INTO "cthx_sms_queue" ("message", "status", "priority", "source") VALUES (?,?,?,?)';
    //tx.executeSql(query,["2,1,1,1,1,1,2","0","2","2"]);
    //tx.executeSql(query,["2,1,1,1,1,1,3","0","2","2" ]);
    
}


function dropTables(tx){
        tx.executeSql('DROP TABLE IF EXISTS cthx_');
       setUpCategoryTable(tx);
       setUpTrainingModules(tx);
       setUpTopics(tx);
       setUpTrainingToModules(tx)
       setUpCadre(tx);
       setUpWorkers(tx);
       setUpTrainingSession(tx);
       setUpTests(tx);
       setUpTestQuestions(tx);
       setUpTestSession(tx);
       setUpCounters(tx);
       setUpJobAids(tx);
       setUpAidsToModules(tx);
       setUpFAQ(tx);
       setUpFAQToModules(tx);
       setUpUserGuides(tx);
       setUpBasicSettings(tx);
       setSMSQueue(tx);
       deleteUsageView(tx);
}
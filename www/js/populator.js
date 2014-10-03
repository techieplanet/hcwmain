/*
 * THIS FILE IS MEANT TO POPULATE/SETUP THE DB TABLES FOR A FRESH DEMO INSTALLATION OF THE APP
 * THE DATA HERE ARE FOR DEMO PURPOSES ONLY. 
 * EACH METHOD CALL IN THE POPULATE() METHOD SETS UP A TABLE
 */

           
function openDb(){
    //alert("inside opendb")
    //create database or open it if created
    globalObj.db = window.openDatabase("chaidbpx", "1.0", "mTrain DB", 200000); 
    //globalObj.db.transaction(populateDB, errorCB, successCB);
    
    //window.localStorage.clear();
    //globalObj.db.transaction(deleteSessions);  //deleter
    
    //get first use localstorage item here. it is being set in firstuse.js saveAdminSettings method.
    var firstrun = window.localStorage.getItem("firstuse");
    //alert('firstrun: ' + firstrun);
    
    if ( firstrun == null ) {
        globalObj.firstTimeUse = true;
        globalObj.db.transaction(populateDB, errorCB, successCB);
    }
    else {
        globalObj.firstTimeUse = false;
    }

    //use to force app into subsequent use mode
    //globalObj.firstTimeUse = true;
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
    tx.executeSql('INSERT INTO cthx_category(category_name,description) VALUES ("Reproductive Health", "")');
    tx.executeSql('INSERT INTO cthx_category(category_name,description) VALUES ("Maternal Health", "")');
    tx.executeSql('INSERT INTO cthx_category(category_name,description) VALUES ("Newborn & Child Health", "")');
    
}

function setUpTrainingModules(tx){
    //alert('inside setmodules');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_module');
    tx.executeSql('CREATE TABLE cthx_training_module (module_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, module_title TEXT, guide_file TEXT, remarks TEXT, admin_id INTEGER, category_id INTEGER)');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Family Planning", "chai_sample.pdf","Dual protection contraception against HIV transmission/STDs and unintended pregnancy; Avoid pregnancy following unprotected intercourse","","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Management of Complications in Pregnancy & Delivery","chai_sample.pdf", "Dual protection contraception against HIV transmission/STDs and unintended pregnancy; Avoid pregnancy following unprotected intercourse","","2")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Management of Newborn Complications","chai_sample.pdf","Dual protection contraception against HIV transmission/STDs and unintended pregnancy; Avoid pregnancy following unprotected intercourse","","3")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,guide_file,remarks,admin_id,category_id) VALUES ("Management of Common Childhood Illnesses","chai_sample.pdf","Dual protection contraception against HIV transmission/STDs and unintended pregnancy; Avoid pregnancy following unprotected intercourse","","3")');
}


function setUpTopics(tx){
    //alert('inside settopics');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training');
    tx.executeSql('CREATE TABLE cthx_training (training_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, training_title TEXT, video_file TEXT)');
    
    //module 1
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Equipment and Materials","refer_sick_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Follow-up Counselling","cold_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Removing Contraceptive Implant Capsules","breathing_problems.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Barrier methods of contraception - The Female condom","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Emergency Contraception","")');
    
    //module 2
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Bleeding after childbirth(postpartum haemorrhage)","breathing_problems.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Pre-eclampsia and Eclampsia","refer_sick_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Bleeding in early pregnancy (Unsafe Abortion)","cold_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Bleeding in Late Pregnancy","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Admitting a woman in Labour and Partograph","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Social support in Labour","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Prolonged obstructed labour","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Other indirect causes of maternal and newborn mortality","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Management of Premature/Prolong rupture of membrane","")');
    
    //module 3
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Examination of the newborn baby","refer_sick_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Care of the newborn baby until discharge","breathing_problems.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Neonatal sepsis","cold_baby.mp4")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Communicate and counsel","")');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Special situations","")');
    
    //module 4
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file) VALUES ("Assess and classify; Identify treatment; Treat the sick child or young infant","breathing_problems.mp4")');
    
}


function setUpTrainingToModules(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_to_module');
    tx.executeSql('CREATE TABLE "cthx_training_to_module" ("module_id" INTEGER NOT NULL, "training_id" INTEGER NOT NULL, PRIMARY KEY ("module_id", "training_id"))');
    
    //module 1, topic 1-5
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,1)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,2)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,3)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,4)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (1,5)');
    
    //module 2, topic 6-14
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,6)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,7)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,8)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,9)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,10)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,11)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,12)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,13)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (2,14)');
    
    //module 3, topic 15-19
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,15)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,16)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,17)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,18)');
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (3,19)');
    
    //module 4, topic 20
    tx.executeSql('INSERT INTO "cthx_training_to_module" ("module_id","training_id") VALUES (4,20)');
}


function setUpWorkers(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_health_worker');
    tx.executeSql('CREATE TABLE "cthx_health_worker" ("worker_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "username" TEXT, "password" TEXT, "firstname" TEXT, "middlename" TEXT, "lastname" TEXT, "gender" TEXT, "email" TEXT, "phone" TEXT, "supervisor" INTEGER, "cadre_id" INTEGER,"secret_question" TEXT,"secret_answer" TEXT)');
    var query = 'INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","secret_question","secret_answer") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    
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
    
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("1",NULL,NULL,"2","1","1","1","1","1")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("2","01-01-2014",NULL,"1","1","1","2","2","6")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("3","01-01-2014",NULL,"1","1","1","1","1","2")');
    
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","material_type","worker_id","module_id","training_id") VALUES ("4","01-01-2014",NULL,"2","1","2","1","2","3")');
}


function setUpTests(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test');
    tx.executeSql('CREATE TABLE "cthx_test" ("test_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "module_id" INTEGER)');
    
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("1","Family Panning","1")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("2","Management of Complications in Pregnancy & Delivery","2")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("3","Management of Newborn Complications","3")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("4","Management of Common Childhood Illnesses","4")');
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
    tx.executeSql(query,["What is the smallest unit of life?",'{"A":"Cell","B":"Blood","C":"Tissue","D":"Organ"}',"Cell","1",'Cell '+tiptext]);
    tx.executeSql(query,["A group of what makes a tissue?",'{"A":"Cells","B":"Organs","C":"Bones","D":"Paper"}',"Cells","1",'Cells '+tiptext]);
    tx.executeSql(query,["A group of what makes an organ?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Lymphocytes"}',"Tissues","1",'Tissues '+tiptext]);
    tx.executeSql(query,["A group of what makes a system?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Organs"}',"Organs","1",'Organs '+tiptext]);
    
    //test 2 questions
    tx.executeSql(query,["Which of these if responsible for transporting oxygen in the blood?",'{"A":"Haemophilia","B":"Haemoglobin","C":"Lymphs","D":"Erythrocytes"}',"Haemoglobin","2",'Haemoglobin '+tiptext]);
    tx.executeSql(query,["Which of these describes someone whose blood does not clot?",'{"A":"Haemophiliac","B":"Erythrocytic","C":"Lymphatic","D":"Haemoglobin"}',"Haemophiliac","2",'Haemophiliac '+tiptext]);
    tx.executeSql(query,["Which of these is associated with female reproduction?",'{"A":"Testosterone","B":"Progesterone","C":"Pituitary Hormones","D":"Endocrine"}',"Progesterone","2",'Progesterone '+tiptext]);
    tx.executeSql(query,["Which of these is not an organ?",'{"A":"Kidney","B":"Liver","C":"Lung","D":"Pancreas"}',"Pancreas","2",'Pancreas '+tiptext]);
    
    //test 3 questions
    tx.executeSql(query,["What is the smallest unit of life?",'{"A":"Cell","B":"Blood","C":"Tissue","D":"Organ"}',"Cell","3",'Cell '+tiptext]);
    tx.executeSql(query,["A group of what makes a tissue?",'{"A":"Cells","B":"Organs","C":"Bones","D":"Paper"}',"Cells","3",'Cells '+tiptext]);
    tx.executeSql(query,["A group of what makes an organ?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Lymphocytes"}',"Tissues","3",'Tissues '+tiptext]);
    tx.executeSql(query,["A group of what makes a system?",'{"A":"Tissues","B":"Cells","C":"Enzymes","D":"Organs"}',"Organs","3",'Organs '+tiptext]);
    
    //test 2 questions
    tx.executeSql(query,["Which of these if responsible for transporting oxygen in the blood?",'{"A":"Haemophilia","B":"Haemoglobin","C":"Lymphs","D":"Erythrocytes"}',"Haemoglobin","4",'Haemoglobin '+tiptext]);
    tx.executeSql(query,["Which of these describes someone whose blood does not clot?",'{"A":"Haemophiliac","B":"Erythrocytic","C":"Lymphatic","D":"Haemoglobin"}',"Haemophiliac","4",'Haemophiliac '+tiptext]);
    tx.executeSql(query,["Which of these is associated with female reproduction?",'{"A":"Testosterone","B":"Progesterone","C":"Pituitary Hormones","D":"Endocrine"}',"Progesterone","4",'Progesterone '+tiptext]);
    tx.executeSql(query,["Which of these is not an organ?",'{"A":"Kidney","B":"Liver","C":"Lung","D":"Pancreas"}',"Pancreas","4",'Pancreas '+tiptext]);
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

function deleteSessions(tx){
    tx.executeSql('DELETE FROM cthx_training_session');
    tx.executeSql('DELETE FROM cthx_test_session');
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
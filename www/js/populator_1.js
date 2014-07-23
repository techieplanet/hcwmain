/*
 * THIS FILE IS MEANT TO POPULATE/SETUP THE DB TABLES FOR A FRESH DEMO INSTALLATION OF THE APP
 * THE DATA HERE ARE FOR DEMO PURPOSES ONLY. 
 * EACH METHOD CALL IN THE POPULATE() METHOD SETS UP A TABLE
 */

           
function openDb(){
    //alert("inside opendb")
    //create database or open it if created
    globalObj.db = window.openDatabase("chaidbpx", "1.0", "CHAI mlearning App DB", 200000); 
    globalObj.db.transaction(populateDB, errorCB, successCB);                           
}
            
function populateDB(tx){
    //alert("inside populatedb")
       _tx = tx;  //set tx for global use at first opportunity
       setUpCategoryTable(tx);
       setUpTrainingModules(tx);
       setUpTopics(tx);
       setUpWorkers(tx);
       setUpTrainingSession(tx);
       setUpTests(tx);
       setUpTestQuestions(tx);
       setUpTestSession(tx);
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
    tx.executeSql('CREATE TABLE cthx_training_module (module_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, module_title TEXT, remarks TEXT, admin_id INTEGER, category_id INTEGER)');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Antenatal Care Series", "this is the module for antenatal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Postnatal Care Series","this is module about post natal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Introduction to Family Planning Education","this is module on family planning","12","2")');
    
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Postnatal Care Series 2","this is module about post natal care","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Advanced Family Planning Education","this is module on family planning","12","1")');
    tx.executeSql('INSERT INTO cthx_training_module (module_title,remarks,admin_id,category_id) VALUES ("Family Planning Benefits","this is module on family planning","12","1")');   
}


function setUpTopics(tx){
    //alert('inside settopics');
    tx.executeSql('DROP TABLE IF EXISTS cthx_training');
    tx.executeSql('CREATE TABLE cthx_training (training_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, training_title TEXT, video_file TEXT, guide_file TEXT, image_file TEXT, module_id INTEGER)');
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file,guide_file,image_file,module_id) VALUES ("Referring A Sick Baby","refer_sick_baby.mp4","","refer_baby.png","1")' );
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file,guide_file,image_file,module_id) VALUES ("The Cold Baby","cold_baby.mp4","","cold_baby.png","1")' );
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file,guide_file,image_file,module_id) VALUES ("Breathing Problems","breathing_problems.mp4","","breathing.png","1")' );
    
    //module 2 topics
    tx.executeSql('INSERT INTO cthx_training (training_title,video_file,guide_file,image_file,module_id) VALUES ("Breathing Problems 2","breathing_problems.mp4","","breathing.png","2")' );
}


function setUpWorkers(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_health_worker');
    tx.executeSql('CREATE TABLE "cthx_health_worker" ("worker_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "username" TEXT, "password" TEXT, "firstname" TEXT, "middlename" TEXT, "lastname" TEXT, "gender" TEXT, "email" TEXT, "phone" TEXT, "supervisor" INTEGER, "cadre_id" INTEGER, "facility_id" INTEGER)');
    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("1","Mr","chappy","chappy","chapman","chapman","chapman","male","chapman@fmail.com","1234567890","1","1","1")');
    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("2","mr","wally","wally","wally","wally","wally","male","wally@gmail.com","1234567890","1","1","1")');
    tx.executeSql('INSERT INTO "cthx_health_worker" ("worker_id","title","username","password","firstname","middlename","lastname","gender","email","phone","supervisor","cadre_id","facility_id") VALUES ("3","miss","katty","katty","katty","katty","katty","male","katty@gmail.com","1234567890","1","1","1")');
}


function setUpTrainingSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_training_session');
    tx.executeSql('CREATE TABLE "cthx_training_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "start_time" DATETIME, "end_time" DATETIME, "status" INTEGER, "session_type" INTEGER, "worker_id" INTEGER, "module_id" INTEGER, "training_id" INTEGER);');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","worker_id","module_id","training_id") VALUES ("1",NULL,NULL,"2","2","1","1","1")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","worker_id","module_id","training_id") VALUES ("2","01-01-2014",NULL,"2","1","1","1","2")');
    //tx.executeSql('INSERT INTO "cthx_training_session" ("session_id","start_time","end_time","status","session_type","worker_id","module_id","training_id") VALUES ("3","01-01-2014",NULL,"2","1","1","1","3")');
}


function setUpTests(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test');
    tx.executeSql('CREATE TABLE "cthx_test" ("test_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" TEXT, "module_id" INTEGER)');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("1","Antenatal Care Test","1")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("2","Postnatal Care Series Test","2")');
    tx.executeSql('INSERT INTO "cthx_test" ("test_id","title","module_id") VALUES ("3","Postnatal Care Series 2 Test","3")');
}


function setUpTestQuestions(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test_question');
    tx.executeSql('CREATE TABLE "cthx_test_question" ("question_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "question" TEXT,"options" TEXT, "correct_option" TEXT, "test_id" INTEGER, "tiptext" TEXT)');
    
    var tiptext ='is the correct answer...';
    var query = 'INSERT INTO "cthx_test_question" ("question","options","correct_option","test_id","tiptext") VALUES (?,?,?,?,?)';
    
    //test 1 questions
    tx.executeSql(query,["What is the capital of Ghana?",'{"A":"Kumasi","B":"Accra","C":"Abuja","D":"Lagos"}',"Accra","1",'Accra '+tiptext]);
    tx.executeSql(query,["What is the capital of Lagos?",'{"A":"Ondo","B":"Osun","C":"Gombe","D":"Ikeja"}',"Ikeja","1",'Lagos '+tiptext]);
    tx.executeSql(query,["What is the capital of South Africa?",'{"A":"Pretoria","B":"Johanesburg","C":"Sowetto","D":"Cape town"}',"Pretoria","1",'Pretoria '+tiptext]);
    tx.executeSql(query,["What is the capital of England?",'{"A":"Bradford","B":"London","C":"Manchester","D":"Liverpool"}',"London","1",'London '+tiptext]);
    
    //test 2 questions
    tx.executeSql(query,["What is the capital of the U.S.A?",'{"A":"Kumasi","B":"Washington","C":"Abuja","D":"Lagos"}',"Washington","2",'Washington '+tiptext]);
    tx.executeSql(query,["What is the capital of Canada?",'{"A":"Ondo","B":"Ottawa","C":"Gombe","D":"Ikeja"}',"Ottawa","2",'Ottawa '+tiptext]);
    tx.executeSql(query,["What is the capital of Russia?",'{"A":"Pretoria","B":"Moscow","C":"Sowetto","D":"Cape town"}',"Moscow","2",'Moscow '+tiptext]);
    tx.executeSql(query,["What is the capital of Scotland?",'{"A":"Bradford","B":"Edinburgh","C":"Manchester","D":"Liverpool"}',"Edinburgh","2",'Edinburgh '+tiptext]);
}

function setUpTestSession(tx){
    tx.executeSql('DROP TABLE IF EXISTS cthx_test_session');
    tx.executeSql('CREATE TABLE "cthx_test_session" ("session_id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "date_taken" DATETIME, "score" INTEGER, "total" INTEGER, "test_id" INTEGER, "worker_id" INTEGER)');
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("1",NULL,"3","4","1","1")');
    //tx.executeSql('INSERT INTO "cthx_test_session" ("session_id","date_taken","score","total","test_id","worker_id") VALUES ("2",NULL,"1","4","1","1")');
    
}

function setUpTrainingToModules(){
    tx.executeSql('DROP TABLE IF EXISTS cthx_module_to_training');
    tx.executeSql('CREATE TABLE "cthx_module_to_training" ("module_id" INTEGER NOT NULL, "training_id" INTEGER NOT NULL, PRIMARY KEY ("module_id", "training_id"))');
    tx.executeSql('INSERT INTO "cthx_module_to_training" ("module_id","training_id") VALUES (?,?,?,?,?)');
}
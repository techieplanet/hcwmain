$(document ).delegate("#jobaidspage", "pagebeforecreate", function() {
    createHeader('jobaidspage','Job Aids');
    createFooter('jobaidspage');
    setNotificationCounts();
});

$(document ).delegate("#jobaidspage", "pageshow", function() {
    setHeaderNotificationCount('jobaidspage');
});

$(document ).delegate("#jobaidspage", "pageinit", function() {        
                        //console.log('jobaidspage');
                        
                        getJobAids(2);
                        
                        $('#sidebar_ul li a').click(function(){
                            $('#sidebar_ul li a').removeClass('active');
                            $(this).addClass('active');
                        });
                        $('#sidebar_ul li:first-child a').addClass('active');
 });
 

function getJobAids(mode){
       var html = '';
       console.log('mode: ' + mode);
       if(mode==1){  //select by current module. Used on training page
            var query = 'SELECT * FROM cthx_jobaid_to_module jm JOIN cthx_jobaid j JOIN cthx_training_module m ' +
                                      'WHERE j.aid_id=jm.aid_id AND m.module_id=jm.module_id ' + 
                                      'AND jm.module_id=' + globalObj.moduleID +
                                      ' ORDER BY aid_title';
            $('#c-bar').html('Job Aids');
       }
       else if(mode==2){ //select all
            var query = 'SELECT * FROM cthx_jobaid';
       }
        
       console.log('all job aids: ' + query);
       
        globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('aids len: ' + len);
                                if(len>0){
                                    //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                    html += '<ul class="content-listing textfontarial12" id="choicelist"  data-role="listview"  >';
                                    for(var i=0; i<resultSet.rows.length; i++){
                                        var row = resultSet.rows.item(i);
                                        html += '<li class="bottomborder width98" data-icon="false" >';
                                        html +=        '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchAid(\''+ row['aid_file'] + '\')">';
                                        html +=             '<p class="bold">' + row['aid_title'] + '</p>';
                                        html +=        '</a>';
                                        html += '</li>';
                                    }

                                    html += '</ul>';

                                    //console.log('html: ' + html);
                                    $('.focus-area').html(html);
                                    $("#trainingpage").trigger('create');
                                    $("#jobaidspage").trigger('create');
                                }
                                else
                                    $('.focus-area').html('No Job Aids found for this module');
                            });                       
                },
                function (error){}                    
            );
       
   }
   
   
function launchAid(aid_file){
    console.log('launching aid');                             
    //alert()
    
    window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                var rootDirectoryEntry = fileSystem.root;
                //alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = globalObj.jobaidsDir + "/" + aid_file;
                //alert('Aid file filePath: ' + filePath);
                
                 /*
                    * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                    * Args:
                    * DirectoryEntry object: provides file look up method
                    * dirPath: path to directory to look up relative to DirectoryEntry
                 */
                rootDirectoryEntry.getFile(
                        filePath, {create: false}, 
                        function(entry){
                            //alert('guide file entry.toURL: '+ entry.toURL());
                            if(!entry.isFile) return;
                            //window.open(entry.toURL(), '_blank', 'location=yes');
                            window.plugins.fileOpener.open(entry.toURL());
                            
                            //update the counts table
                            counterUpdate('job_aids');
                             
                        },
                        function(error){
                            $('.focus-area').html('No Job Aids found for this module');
                        }
                 );
                
            }, 
            function(error) {
                alert("File System Error: " + JSON.stringify(error));
            }
          );
              
}

function counterUpdate(field){
    globalObj.db.transaction(function(tx){
                    query='SELECT ' + field + ' FROM cthx_counters';
                    tx.executeSql(query,[],
                                function(tx,result){
                                    var row = result.rows.item(0);
                                    var ccount = row[field];
                                    console.log('ccount: ' + ccount);
                                    
                                    var fields = ""+field;
                                    var values = "" + (ccount+1)
                                    
                                    DAO.update(tx, 'cthx_counters', fields, values, field, ccount);
                                }
                            );
            },
            function(error){
                console.log('Error updating usage count');
            }
    );
}


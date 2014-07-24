function getJobAids(){
       var html = '';
       var query = 'SELECT * FROM cthx_jobaid_to_module jm JOIN cthx_jobaid j JOIN cthx_training_module m ' +
                                      'WHERE j.aid_id=jm.aid_id AND m.module_id=jm.module_id ' + 
                                      'AND jm.module_id=' + globalObj.moduleID;
       console.log('all job aids: ' + query);
       
        globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('aids len: ' + len);
                                if(len>0){
                                    //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                    html += '<ul id="choicelist"  data-role="listview"  >';
                                    for(var i=0; i<resultSet.rows.length; i++){
                                        var row = resultSet.rows.item(i);
                                        html += '<li class="" data-icon="false" >';
                                        html +=        '<a href="#" onclick="launchAid(\''+ row['aid_file'] + '\')">' + row['aid_title'] + '</a>';
                                        html += '</li>';
                                    }

                                    html += '</ul>';

                                    //console.log('html: ' + html);
                                    $('.focus-area').html(html);
                                    $("#trainingpage").trigger('create');
                                }
                                else
                                    $('.focus-area').html('No Job Aids found for this module');
                            });                       
                },
                function (error){}                    
            );
       
   }
   
   
function launchAid(aid_file){
    alert('launching aid');                             
    //counterUpdate('job_aids');
    
    window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0, 
            function(fileSystem){
                var rootDirectoryEntry = fileSystem.root;
                alert('root: ' + fileSystem.root.fullPath);
                
                var filePath = globalObj.jobaidsDir + "/" + aid_file;
                alert('Guide file filePath: ' + filePath);
                
                 /*
                    * This method (getFile) is used to look up a directory. It does not create a non-existent direcory.
                    * Args:
                    * DirectoryEntry object: provides file look up method
                    * dirPath: path to directory to look up relative to DirectoryEntry
                 */
                rootDirectoryEntry.getFile(
                        filePath, {create: false}, 
                        function(entry){
                            alert('guide file entry.toURL: '+ entry.toURL());
                            if(!entry.isFile) return;
                            //window.open(entry.toURL(), '_blank', 'location=yes');
                            window.plugins.fileOpener.open(entry.toURL());
                            
                            //update the counts table
                            counterUpdate('job_aids');
                             
                        },
                        function(error){
                            //alert("No Video Found: " + JSON.stringify(error) + "\n Switching to Default Video.");
                            alert("No Guide Found.");
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


$(document ).delegate("#faqpage", "pageinit", function() {        
                        //console.log('faqpage');
                        getFAQ(2);
                        
                        $('#sidebar_ul li a').click(function(){
                            $('#sidebar_ul li a').removeClass('active');
                            $(this).addClass('active');
                        });
                    }
            );
   
function getFAQ(mode){
       var html = '';
       $('#c-bar').html('Frequently Asked Questions');
       
       //console.log('mode: ' + mode);
       if(mode==1){  //select by current module. Used on training page
            var query = 'SELECT * FROM cthx_faq_to_module fm JOIN cthx_faq f JOIN cthx_training_module m ' +
                                      'WHERE f.faq_id=fm.faq_id AND m.module_id=fm.module_id ' + 
                                      'AND fm.module_id=' + globalObj.moduleID;
       }
       else if(mode==2){ //select all
            var query = 'SELECT * FROM cthx_faq';
       }
        
       console.log('all faq: ' + query);
       
        globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('faq len: ' + len);
                                var html ='';
                                if(len>0){
                                    
                                    html += '<div id="collapsible_content" data-role="collapsibleset" class="textfontarial13 textleft" >';
                                    html += '</div>'
                                    $('.focus-area').html(html);
                                    $('#faqpage').trigger('create');
                                    
                                    html ='';
                                    for(var i=0; i<len; i++){
                                        var row = resultSet.rows.item(i);
                                        //console.log('faq row: ' + JSON.stringify(row));
                                        html += '<div id="faq_' +  row['faq_id'] + '" data-role="collapsible" data-icon="arrow-d" data-iconpos="right"  class="c-inner-content">';
                                        html +=     '<h1 class="" >' + row['question'] + '</h1>';
                                        html +=     '<p style="background:none;">' + row['answer'] + '</p>';
                                        html += '</div>';
                                        
                                        //console.log(html);
                                        $('#collapsible_content').append(html);

                                        $('#faq_' +  row['faq_id']).trigger('create');
                                        $('#collapsible_content').trigger('create');
                                        html='';
                                    }
                                }
                                else
                                    $('.focus-area').html('No FAQ found');
                                
                                //$('#faqpage').trigger('create');
                            });                       
                },
                function (error){}                    
            );
       
   }
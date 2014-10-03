$(document ).delegate("#helppage", "pagebeforecreate", function() {
    globalObj.currentPage = 'helppage';
    createHeader('helppage','Help');
    createFooter('helppage');
    setNotificationCounts();
});

$(document ).delegate("#helppage", "pageshow", function() {
    setHeaderNotificationCount('helppage');
    
   
});


$(document ).delegate("#helppage", "pageinit", function() {        
                        //console.log('helppage');
                        getHelpFiles();
                        
                        //show the footer logged in user
                        showFooterUser();
                        
                        $('#sidebar_ul li a').click(function(){
                            $('#sidebar_ul li a').removeClass('active');
                            $(this).addClass('active');
                        });
                        
                        $('#userguidelink').addClass('active');
                        
          });
            
            
function getHelpFiles(){
       var html = '';
       var query = 'SELECT * FROM cthx_user_guide ORDER BY guide_title';
       $('#c-bar').html('User Guides');
       
       console.log('user guides aids: ' + query);
       
        globalObj.db.transaction(function(tx){
                        tx.executeSql(query,[],
                            function(tx,resultSet){
                                var len = resultSet.rows.length;
                                console.log('ug len: ' + len);
                                if(len>0){
                                    //console.log('rows: ' + JSON.stringify(resultSet.rows.item(0)))
                                    html += '<ul class="content-listing textfontarial12" id="choicelist"  data-role="listview"  >';
                                    for(var i=0; i<resultSet.rows.length; i++){
                                        var row = resultSet.rows.item(i);
                                        html += '<li class="bottomborder " data-icon="false" >';
                                        html +=        '<a class="margintop10 notextdecoration textblack" href="#" onclick="launchPDF(\'' + globalObj.helpDir + '\',\''+ row['guide_file'] + '\')">';
                                        html +=             '<p class="">' + row['guide_title'] + '</p>';
                                        html +=        '</a>';
                                        html += '</li>';
                                    }

                                    html += '</ul>';

                                    //console.log('html: ' + html);
                                    $('.focus-area').html(html);
                                    $("#helppage").trigger('create');
                                }
                                else
                                    $('.focus-area').html('No User Guides found');
                            });                       
                },
                function (error){}                    
            );
       
   }
   
   
function getInfo(){
       $('#c-bar').html('Information');
       var html = '<ul class="content-listing textfontarial12" data-role="listview">';
       
       html += '<li  data-icon="false" class="bottomborder margintop10">' +
                    '<div>' +
                        '<p class="bold">FACILTIY</p>' +
                        '<p>XYZ Health Center</p>' +
                        '<p>Plot 2-5, Trans Amadi, Port Hacourt</p>' +
                        '<p>Nigeria.</p>' +
                    '</div>' +
               '</li>';
           
       html += '<li  data-icon="false" class="bottomborder margintop20">' +
                    '<div>' +
                        '<p class="bold uppercase">Facility Supervisor</p>' +
                        '<p>Adebayo A. Salako</p>' + 
                        '<p>08012345678</p>' +
                    '</div>'
               '</li>';
               
       html += '</ul>';
       
        $('.focus-area').html(html);
        $("#helppage").trigger('create');
   }
   
   
   function getAbout(){
       $('#c-bar').html('mTrain - Mobile Training Solutioin');
       
       var html = '<ul class="content-listing textfontarial12" data-role="listview">';
                  
           html +=  '<li  data-icon="false" class="bottomborder margintop20">' +
                            '<p class="bold">Powered By:</p>' +
                            '<p class="text999 textfontarial13">Federal Ministry of Health</p>' +
                     '</li>'; 
                     
           html +=  '<li  data-icon="false" class="bottomborder margintop20">' +
                            '<p class="bold">Software</p>' +
                            '<p class="text999 textfontarial13">' +
                                 'Version a.b Release x.y <br/> Release Date: Jul 25, 2014'  
                            '</p>' +
                     '</li>'; 
                 
                 
//           html +=  '<li  data-icon="false" class="bottomborder margintop20">' +
//                            '<p class="bold">Powered By</p>' +
//                            '<p class="text999 textfontarial13">Techie Planet</p>' +
//                     '</li>'; 
         
           html += '</ul>';
           
           html += '<p class="bold margintop40 textfontarial12">Terms of Use</p>';
           html +=  '<div class="noborder margintop10 textfontarial12 full-length-box">' + 
                       'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut' + 
                       'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco' + 
                       'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in' +
                       'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat' +
                       'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                   '</div';
                   
           $('.focus-area').html(html);
           $("#helppage").trigger('create');
   }
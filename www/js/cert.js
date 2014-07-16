



$(document ).delegate('#certpage', "pageinit", function () {
    console.log('cert page init - score: ' + globalObj.testScoreCount + ', total: ' + globalObj.testTotalCount);
    
    $('#certscore').html(globalObj.testScore);
    $('#certtotal').html(globalObj.testTotal);
    $('#certgrade').html(gradeCalc(globalObj.testScore, globalObj.testTotal));
    $('#testtitle').html(globalObj.testTitle);

    $('#certpage').trigger('create');
});


function gradeCalc(score,total){
    var ptage = score * 100 / total;
    return getGradeLongText(ptage);
}

function getGradeLongText(ptage){
    var str = '';
    if(ptage < 40){
        str = 'Wow! ' + ptage + '% is below par.<br/> You may want to retake this test<br/>';
        str += '<a href="question.html" class="" data-theme="b" data-role="button" >Retake Test</a>';
    }
    else if(ptage >= 40 && ptage < 60){
        str = 'Hmmm! ' + ptage + '% not so good.<br/> You may want to retake this test for higher scores';
        str += '<a href="question.html" class="" data-theme="b" data-role="button" >Retake Test</a>';
    }
    else if(ptage >= 60 && ptage < 80){
        str = 'Good! ' + ptage + '% is okay.<br/> You may want to retake this test for even higher scores';
        str += '<a href="question.html" class="" data-theme="b" data-role="button" >Retake Test</a>';
    }
    else {
        str = 'Bravo! ' + ptage + '% is great. Good job!';
    }
    
    return str;
}


function getGradeText(ptage){

    if(ptage < 40){
        return 'Fail';
    }
    else if(ptage >= 40 && ptage < 60){
        return 'Underperformed';
    }
    else if(ptage >= 60 && ptage < 80){
        return 'Average'
    }
    else {
        return 'High Performance'
    }
    
}
const romaji = ["a","i","u","e","o","ka","ki","ku","ke","ko","sa","shi","su","se","so","ta",
                "chi","tsu","te","to","na","ni","nu","ne","no","ha","hi","fu","he","ho","ma","mi","mu","me","mo","ya",
                "yu","yo","ra","ri","ru","re","ro","wa","wo","n"];
var selectedChars = [];
var questionsAsked = 0
var userAnswers = []
var addScores = [];
var romajiIndex = [];
var toggleFlag = false;

//populate table with user's scores
function showScores(){
    $('#hideScores').show();
    $('#scoresTable').show();
    $('#scoresButton').text("UPDATE SCORES");
    $.ajax({ type:"POST", url: '../web-service/getscores.php',
    success:function(result){
        var scoresArray = result.split(",");
        var table = document.getElementById("scoresTable");
        //check scores haven't already been populated
        if(table.rows.length === 0){
            var row = table.insertRow();
            for(var i = 0; i < 23; i++){
                var newCell = row.insertCell(i)
                newCell.innerText = (romaji[i]);
            }
            var row = table.insertRow();
            for(var i = 0; i < 23; i++){
                var newCell = row.insertCell(i)
                newCell.innerText = (scoresArray[i]);
                newCell.style.backgroundColor="Gray";
            }
            var row = table.insertRow();
            for(var i = 0; i < 23; i++){
                var newCell = row.insertCell(i)
                newCell.innerText = (romaji[i+23]);
            }
            var row = table.insertRow();
            for(var i = 0; i < 23; i++){
                var newCell = row.insertCell(i)
                newCell.innerText = (scoresArray[i+23]);
                newCell.style.backgroundColor="Gray";
            }
        } else { //update existing scores table
            var table = document.getElementById("scoresTable");
            for(var i = 0; i < 23; i++){
                table.rows[1].cells[i].innerText=scoresArray[i] 
            }
            for(var i = 0; i < 23; i++){
                table.rows[3].cells[i].innerText=scoresArray[i+23] 
            }
        }
}})
}

function hideScores(){
    $('#scoresTable').hide();
    $('#hideScores').hide();
    $('#scoresButton').text("SHOW MY SCORES");
}

//Show user's correct guesses on each character
function toggleProgress(){
    var table = document.getElementById("mainTable");
    var rowsLength = table.rows.length;
    var cellsLength = table.rows[0].cells.length;
    
    if(!toggleFlag){
        $('.toggleText').show();
        toggleFlag = true;
        
        $.ajax({type:"POST", url: '../web-service/getscores.php',
        success:function(result){
            var scoresArray = result.split(',');
            var scoreIndex = 0;
            
            for(var i = 0; i < cellsLength; i++){
                for(var j = 1; j < rowsLength; j++){
                    var cell = table.rows[j].cells[i]
                    
                    if(cell.innerText.length > 3){
                        if(scoresArray[scoreIndex] >= 10){
                            cell.style.backgroundColor="Black";
                            cell.style.color="white"; 
                            document.getElementById(scoreIndex).style.filter = "invert(100%)";
                            document.getElementById(scoreIndex).style.WebKitfilter = "invert(100%)";
                        } else if(scoresArray[scoreIndex] >= 5){
                            cell.style.backgroundColor="Gray";
                            cell.style.color="white"; 
                            document.getElementById(scoreIndex).style.filter = "invert(90%)";
                            document.getElementById(scoreIndex).style.WebKitfilter = "invert(90%)";
                        } else if(scoresArray[scoreIndex] >= 3){
                            cell.style.backgroundColor="Silver";
                        } else if(scoresArray[scoreIndex] >= 1){
                            cell.style.backgroundColor="LightGray";
                        }
                        scoreIndex++
                    }
                }
            }
        }
        })
    } else {
        $('.toggleText').hide();
        toggleFlag = false;
        //set back to default
        for(var i = 1; i < rowsLength; i++){
            for(var j = 0; j < cellsLength; j++){
                var cell = table.rows[i].cells[j]
            
                    cell.style.backgroundColor="white";
                    cell.style.color="black"; 
                
            }
        } for(var j = 0; j < 46; j++){
            document.getElementById(j).style.filter = "invert(0%)";
            document.getElementById(j).style.WebKitfilter = "invert(0%)";
        }
    }
}

//quiz questions
askQuestion = function() {
    var toTest = selectedChars
    var questionType = Math.floor(Math.random()*2); //decide whether each question is hiragana or romaji
    //get 10 questions from selected training set regardless of size
    var nextQuestion = toTest[(questionsAsked + toTest.length)%toTest.length] 
    var answers=[]; //answer options
    answers.push(nextQuestion)  //ensure one of the answers is the correct one

    //pick 3 random romaji for remaining MCQ answers
    for(var i = 0; i < 3; i++){
        answers.push(romaji[Math.floor(Math.random()*46)]);
    }
    //shuffle answers
    for (var i = answers.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
    }

    if(questionType === 0){ 
        document.querySelector('#question').innerHTML='QUESTION '+(questionsAsked+1)+ '<br><br> Select the romaji equivalent of the following hiragana:';
        document.querySelector("#thisQuestion").innerHTML="<img src='images/"+nextQuestion+".png'>";
        document.querySelector('#ans1').innerText=answers[0];
        document.querySelector('#ans2').innerText=answers[1];
        document.querySelector('#ans3').innerText=answers[2];
        document.querySelector('#ans4').innerText=answers[3];
    } else {
        document.querySelector('#question').innerHTML='QUESTION '+(questionsAsked+1)+ '<br><br> Select the hiragana equivalent of the following romaji';
        document.querySelector('#thisQuestion').innerText=nextQuestion
        document.querySelector('#ans1').innerHTML="<img src='images/"+answers[0]+".png'>"
        document.querySelector('#ans2').innerHTML="<img src='images/"+answers[1]+".png'>"
        document.querySelector('#ans3').innerHTML="<img src='images/"+answers[2]+".png'>"
        document.querySelector('#ans4').innerHTML="<img src='images/"+answers[3]+".png'>"
    }

    questionsAsked++;
}

//show quiz results
showResults = function() {
    $(document).ready(function(){
        $('#actualQuiz').hide()
        $('#results').fadeIn()
    })
    var correct = 0;   
    var progressed = [];    //characters guessed correctly

    for(var i = 0; i < userAnswers.length; i++){
        if(userAnswers[i] === selectedChars[(i+selectedChars.length) % selectedChars.length]){
            correct++;
            var indexOfChar = progressed.indexOf(userAnswers[i]);
            if(indexOfChar === -1){
                progressed.push(userAnswers[i]);
                romajiIndex.push(romaji.indexOf(userAnswers[i]));
                addScores.push(1);
            } else {
                addScores[indexOfChar]++;
            }
    }
    var percent = correct*10;
    document.querySelector('#percent').innerHTML="You scored " +correct+ "/10<br>" +percent+ "%"
}
};

//save results to database
saveResults = function() {
    var addScoresString = addScores.toString();
    var romajiIndexString = romajiIndex.toString();
    $.ajax({type: "POST", url: "../web-service/savequiz.php", 
        data: {progressed:addScoresString, romajiIndex:romajiIndexString},
        success:function(response){
            //alert(response)
            if(response == 0){
                $('#save').hide();
                alert("Results saved successfully");
                //$('#saved').text("Results saved")
            } else if (response == 2){
                alert("Please log in above to update your results")
            }
        },    
        error:function(response) {
            alert("Error saving results, please try again" + response) }
        })

} ;
        //alert("addScores= " +addScoresString +" romajiIndex= " +romajiIndexString);
        

//hide quiz and reselt variables
finishQuiz = function() {
    selectedChars.length = 0;
    questionsAsked = 0;
    userAnswers.length = 0;
    addScores.length = 0;;
    romajiIndex.length = 0;
    document.querySelector('#selected').innerText="";
    $('#results').hide();
    $('#save').show();
    $('#mainTable').show();
    $('#quizSelector').hide();
};


//jquery functions
$(document).ready(function(){
    //Play gif on hover
    $('#mainTable td').hover(function () {
        $(this).find('img').attr('src', function (i, src) {
            return src.replace('png', 'gif').replace('images', 'gifs')
        })
    }, function () {
        $(this).find('img').attr('src', function (i, src) {
            return src.replace('gifs', 'images').replace('gif', 'png')
        })
    })

    //Play audio pronunciation on click
    $('#mainTable td').click(function () {
        var audioElement = document.createElement('audio');
        var letter = $(this).text();
        letter = letter.slice(1,-1);
        audioSrc = 'sounds/'+letter+'.ogg';
        audioElement.setAttribute('src', audioSrc);
        audioElement.play();
    })

    //Show quiz table on quiz button click
    $("#quizButton").click(function() {
        $('#mainTable').hide();
        $('#quiz').show();
        $('#quizSelector').show();
        $('#quizTable').show();
    });

    //Select training set elements for quiz
    $('#quizTable td').hover(function () {
        $(this).css({'cursor':'pointer', 'opacity':'0.5'});
    }, function () {
        $(this).css({'cursor':'auto', 'opacity':'1'});
    });
    $('#quizTable td').click(function () {
        var letter = $(this).text();
        if(letter == null || letter == ""){
            return;
        }
        if(selectedChars.includes(letter)){
            selectedChars.splice(selectedChars.indexOf(letter),1)
        } else { 
            if(selectedChars.length == 10) {
                alert('You have already selected 10 hiragana. To select ' +letter+ ', please deselect another first')
            } else {
                selectedChars.push(letter) }
                //alert(selectedChars);
        }
        document.querySelector('#selected').innerText=selectedChars;
    })

    //Register new user
    $("#newUserSubmit").click(function(){
        event.preventDefault();
        let userName = $("#username").val().trim();
        let userPassword = $("#password").val().trim();
        
        if( userName != "" && userPassword != "" ){

            $.ajax({type: "POST", url: "../web-service/register.php", 
                data: {userName:userName, userPassword:userPassword},
                success: function(result){
                    //alert(result);
                if(result === "registered"){
                // alert("Successfully registered!");
                    $('#userReg').hide() 
                    //$('#userScores').show()
                    $('#status').text("Thank you for registering, please login");
             
                } else if(result == "1"){
                    alert("Username already taken, please try again");
                
                } else {
                    alert("Something went wrong. Please try again");
                }
            }
            });

        } else {
            alert("Username and/or Password can't be blank")
        }
    });

    //Login
    $("#loginSubmit").click(function(){
        event.preventDefault();
        let userName = $("#newUsername").val().trim();
        let userPassword = $("#newPassword").val().trim();
        //alert(userName +" "+ userPassword);
        if( userName != "" && userPassword != "" ){

            $.ajax({type: "POST", url: '../web-service/login.php', 
                data: {userName:userName, userPassword:userPassword},
                success:function(result){
                if(result == 1 ){
                    $("#login").hide();
                    $('#userReg').hide();
                    $('#logout').show();
                    $('#scores').show();
                    $('#scoresButton').text("SHOW MY SCORES");
                    $('#toggle').show();
                    $('#status').text("Logged in as " +userName);
                } else {
                    //alert(result);
                    alert("Invalid username or password");;
                }
                
            }})
        } else {
                alert("Username and/or Password can't be blank")
            }
    });

    //Logout
    $('#logoutButton').click(function(){
        $.ajax({type:"POST", url: '../web-service/logout.php',
        success:function(result){
            //alert("logged out")
            $("#login").show();
            $('#userReg').show();
            $('#logout').hide();
            $('#scores').hide();
            $('#scoresTable').hide();
            $('#hideScores').hide();
            $('#toggle').hide();
            $('#status').text("Logged out");
            toggleFlag = true;
            toggleProgress();
        }})
    })

    //start quiz
    $('#startQuiz').click(function () {
        $('#quizSelector').hide();
        $('#actualQuiz').show();
        askQuestion();
    })

    //cancel quiz
    $('#cancelQuiz').click(function () {
       finishQuiz();
    })

    //change css when hovering over MCQ answers
    $('#answers td').hover(function () {
        $(this).css({'cursor':'pointer', 'opacity':'0.5'});
    }, function () {
        $(this).css({'cursor':'auto', 'opacity':'1'});
    });
    
    //user selects an answer in MCQ
    $('#answers td').click(function () {
        var userSelected;
        if($(this).text()!==""){
            userSelected = $(this).text()
        } else {
            userSelected = $(this).html()
            //extract letter(s)
            var slash = userSelected.indexOf('/');
            var dot = userSelected.indexOf('.');
            userSelected = userSelected.substring(slash+1,dot);
        }
        userAnswers.push(userSelected)
        if(questionsAsked < 10){
            askQuestion()
        } else {
        // alert(userAnswers + " (userAnswers)")
            showResults()
        }
    })
   
});

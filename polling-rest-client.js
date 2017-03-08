var basketBallScoresLoc = 'http://localhost:' + port + '/scores';
var numberOfPolls = 0;
var cavsId = 'cavsScore';
var warriorsId = 'warsScore';
var numberOfPollsId = 'numOfPolls';
var timeDiffId = 'timeDiff';

var totaltime = 0;

setInterval(function () {
    console.log("called");
    var xhr = new XMLHttpRequest();
    var startTime = new Date();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                numberOfPolls++;
                var scores = JSON.parse(xhr.response.toString());
                document.getElementById(cavsId).innerHTML = scores.Cavaliers;
                document.getElementById(warriorsId).innerHTML = scores.Warriors;
                document.getElementById(numberOfPollsId).innerHTML = numberOfPolls;
                var endTime = new Date();
                var timeDiff = endTime - startTime;
                totaltime+= timeDiff;
                document.getElementById(numberOfPollsId).innerHTML = numberOfPolls;
                document.getElementById(timeDiffId).innerHTML = totaltime / numberOfPolls;
            }

        }
    };
    xhr.open('GET', basketBallScoresLoc, true);
    xhr.send(null);
}, 5000);
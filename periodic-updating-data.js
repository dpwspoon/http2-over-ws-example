var events = require('events');
var util = require('util');
const EventEmitter = require('events');

function WarriorsCavsGame() {
    this.numberOfUpdates = 0;
    events.EventEmitter.call(this);
    this.cavsScore = 0;
    this.warriorsScore = 0;

    var _this = this;
}
util.inherits(WarriorsCavsGame, EventEmitter);

WarriorsCavsGame.prototype.getScore = function(){
    return JSON.stringify({
        "Warriors": this.warriorsScore,
        "Cavaliers": this.cavsScore
    })
};

WarriorsCavsGame.prototype.start = function(){
    console.log("started warriors cavs game");
    var _this = this;
    (function loop() {
        var rand = Math.round(Math.random() * (3000 - 500)) + 500;
        setTimeout(function () {
            // random score update
            var scoredAmount = Math.floor(Math.random() * (4 - 1)) + 1;
            var goesToWarriors = (Math.random() * (5 - 1) + 1) > 2.4;
            _this.numberOfUpdates += 1;
            console.log("Update " + _this.numberOfUpdates + " : \t Warriors: " + _this.warriorsScore +
                "\t\t| Cavaliers: " + _this.cavsScore);

            if (goesToWarriors) {
                _this.warriorsScore += scoredAmount;
            } else {
                _this.cavsScore += scoredAmount;
            }
            _this.emit('score', _this.getScore());
            loop();
        }, rand);
    }());
};


module.exports = WarriorsCavsGame;
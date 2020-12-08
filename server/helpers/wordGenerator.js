const sentencer = require('sentencer');

module.exports.generateWords = function() {
    var easy = sentencer.make("{{ noun }}");
    var medium = sentencer.make("{{ noun }}");
    var hard = sentencer.make("{{ adjective }}");

    return [
        {
            word: easy,
            difficulty: 1,
        },
        {
            word: medium,
            difficulty: 2,
        },
        {
            word: hard,
            difficulty: 3,
        },
    ]
}

module.exports.convertWordToHint = function(word) {
    let spacedWord = word.split('').join(' ');
    return spacedWord.replace(/[^ ]/g, '_');
}

module.exports.getScore = function(score, maxTime) {
    let newScore = scaleValue(score, [1, 3*maxTime], [100,1000]);

    //round to nearest 100
    newScore = Math.round(newScore/100)*100

    return newScore;
};

function scaleValue(value, from, to) {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
	var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
	return ~~(capped * scale + to[0]);
}
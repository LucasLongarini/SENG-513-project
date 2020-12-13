const nthline = require('nthline');
const easyFile = './words/easy.txt';
const mediumFile = './words/medium.txt';
const hardFile = './words/hard.txt';

module.exports.generateWords = async function() {

    // returns a random integer from 0 to 149
    let easyIndex = Math.floor(Math.random() * 150);      
    let mediumIndex = Math.floor(Math.random() * 150);      
    let hardIndex = Math.floor(Math.random() * 150); 

    let easyPromise = nthline(easyIndex, easyFile);
    let mediumPromise = nthline(mediumIndex, mediumFile);
    let hardPromise = nthline(hardIndex, hardFile);

    let data = await Promise.all([easyPromise, mediumPromise, hardPromise]);

    var easy = data[0];
    var medium = data[1];
    var hard = data[2];

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
    return word.replace(/[^ ]/g, '_');
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

module.exports.revealWordHint = function(word, wordHint) {
    let indexes = [];
    for (let i = 0; i<wordHint.length; i++) {
        if (wordHint[i] === '_')
            indexes.push(i);
    }
    
    // random number between 0 and indexes.length - 1
    let randomIndex = Math.floor(Math.random() * indexes.length);
    let characterIndex = indexes[randomIndex];
    let newWord = wordHint.replaceAt(characterIndex, word[characterIndex]);

    return newWord;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
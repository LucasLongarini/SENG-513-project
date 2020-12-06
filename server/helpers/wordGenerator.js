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
const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    RoomId: mongoose.ObjectId,
    Round: Number,
    Timer: Number,
    CurrentTurn: mongoose.ObjectId,
    RoundWord: String,
    Players: [{
        Id: mongoose.ObjectId,
        HasCompletedTurn: {
            type: Boolean,
            default: false
        },
        HasGuessedCorrectly: {
            type: Boolean,
            default: false
        },
        Score: {
            type: Number,
            default: 0
        },
    }],
});


module.exports = mongoose.model('Game', GameSchema, "Games");
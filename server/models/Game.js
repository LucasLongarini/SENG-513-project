const mongoose = require('mongoose');

const GameSchema = mongoose.Schema({
    RoomId: mongoose.ObjectId,
    CurrentRound: {
        type: Number,
        default: 1,
    },
    TotalRounds: Number,
    Timer: Number,
    CurrentTurn: mongoose.ObjectId,
    RoundWord: String,
    RoundWordDifficulty: {
        type: Number,
        default: 1
    },
    Players: [{
        _id: mongoose.ObjectId,
        SocketId: String,
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
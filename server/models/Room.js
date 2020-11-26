const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    IsPrivate: {
        type: Boolean,
        required: true
    },
    Password: {
        type: String,
        require: false
    },
    Rounds: {
        type: Number,
        required: true
    },
    Timer: {
        type: Number,
        required: true
    },
    IsSpellCheck: {
        type: Boolean,
        required: true
    },
    HostId: {
        type: mongoose.ObjectId,
        required: true
    },
    UserIds: {
        type: [mongoose.ObjectId],
        required: false
    }
});


module.exports = mongoose.model('Room', RoomSchema, "Rooms");
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type:String,
        required: false,
        unique: true
    },
    Password: {
        type: String,
        required: false
    }, 
    EmojiId: {
        type: Number,
        default: 1
    },
    IsGuest: {
        type: Boolean,
        required: true
    }
});


module.exports = mongoose.model('User', UserSchema, "Users");
const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose'); 
const Room = require('../../models/Room');
const User = require('../../models/User');


module.exports = function(io) {
    io.on('connection', async (socket) => {
        let userId;
        let roomId;
        let userName;
        try{
            const decoded = jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET);
            userId = decoded.id;
            roomId = socket.handshake.query.roomId;
            let user = await User.findById(mongoose.Types.ObjectId(userId.toString()));

            if (user === undefined || user === null)
                return socket.emit('disconnect');
            else
                userName = user.Name;
        }
        catch {
            return socket.emit('disconnect');
        }

        socket.join(roomId);

        // emit user joined event to room
        userHasConnected(io, userId, roomId);
            //socket.emit('disconnect');

        //TODO check if there is a game in progress. If so, emit that data back to the socket


        // Room settings updating event
        socket.on('update room settings', setting => {
            socket.broadcast.to(roomId).emit('new room settings', setting);
        });

        socket.on('disconnect', () => {
            userHasDisconnected(io, userId, roomId);
        });

        socket.on('start game', () => {
            startGame(io, userId, roomId);
        });

        socket.on('send word', word => {
            newWord(io, socket, word, userId, roomId, userName);
        });

    });
}

// TODO check if word is correct;
function newWord(io, socket, word, userId, roomId, userName) {
    io.to(roomId).emit('new word', {name: userName, word: word});
}

// starts a game and sets initial state
async function startGame(io, userId, roomId) {
    // TODO: set initial game state
    try {
        // check that the calling socket can actually start the game
        let room = await Room.findOne({_id: roomId});

        if (userId.toString() === room.HostId.toString()) {
            io.to(roomId).emit('game start');
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function userHasDisconnected(io, userId, roomId) {
    try {
        // remove user from the userIDs
        await Room.updateOne(
            { _id: roomId },
            { $pull: { UserIds: userId } }
        );

        let room = await Room.findOne({_id: mongoose.Types.ObjectId(roomId)});
        
        // if no more users, close the room
        if (room.UserIds.length == 0){
            await Room.deleteOne({_id: mongoose.Types.ObjectId(roomId)});
        }

        // if the user was the host, update the host to a new user (first in the array)
        else if (userId.toString() === room.HostId.toString()) {
            // in this state, there will always be at least 1 user in UserIds, we will take the first user and make them the new host
            let newHostId = room.UserIds[0];
            await Room.updateOne(
                { _id: roomId },
                { HostId: newHostId}
            );

            io.to(roomId).emit('new host', newHostId);
        }

        // send 'user disconnected' event to room
        io.to(roomId).emit('user disconnected', userId);
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

async function userHasConnected(io, userId, roomId) {
    try {
        //check if room is full. If so, disconnect socket.
        let room = await Room.findOne({_id: mongoose.Types.ObjectId(roomId)});
        if (room.UserIds.length >= 8) 
            return false;
        
        // append the new user to the joined list if they are not already
        let newUser = await User.findOne({_id: mongoose.Types.ObjectId(userId)});

        if (!room.UserIds.find(i => i.toString() === userId.toString()))
        {
            await Room.updateOne(
                { _id: roomId },
                { $push: {UserIds: userId} }
            );
        }

        // send the user joined event to all sockets joined to the room except the sender
        io.to(roomId).emit('user connected', 
            {
                id: newUser._id,
                name: newUser.Name,
                emojiId: newUser.EmojiId,
            }
        );
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

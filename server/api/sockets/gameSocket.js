const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose'); 
const Room = require('../../models/Room');
const User = require('../../models/User');
const Game = require('../../models/Game');


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
        if (!await userHasConnected(io, userId, roomId)) 
            socket.emit('force disconnect');
        

        // if there is a game in progress, emit that data back to the socket
        getGameState(socket, roomId);

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

// gets the initial game state, if any, and emits it back to the socket joining (for players joining mid game)
//TODO send proper game data
async function getGameState(socket, roomId) {

    let game = await Game.findOne({RoomId: roomId});
    console.log(game);
    if (game) {
        socket.emit('game in progress', {
            round: game.Round,
        });
    }

}

// TODO check if word is correct;
function newWord(io, socket, word, userId, roomId, userName) {
    io.to(roomId).emit('new word', {name: userName, word: word});
}

// starts a game and sets initial state
async function startGame(io, userId, roomId) {
    try {
        // check that the calling user socket can actually start the game
        let room = await Room.findOne({_id: roomId});

        if (userId.toString() !== room.HostId.toString())
            return;
        
        
        let newGame = new Game({
            RoomId: roomId,
            Round: 1,
            Timer: room.Timer,
            CurrentTurn: room.HostId,
            RoundWord: "",
            Players: room.UserIds.map((id) => {
                return {
                    _id: id,
                }
            })
        });

        await newGame.save();
        io.to(roomId).emit('game start');
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

        // remove user from the game players if the game exists
        await Game.updateOne(
            { RoomId: roomId },
            { $pull: { Players: {_id: userId} }},
        );

        let room = await Room.findOne({_id: mongoose.Types.ObjectId(roomId)});
        
        // if no more users, close the room & the game if it exists
        if (room.UserIds.length == 0){
            await Room.deleteOne({_id: mongoose.Types.ObjectId(roomId)});
            await Game.deleteOne({RoomId: mongoose.Types.ObjectId(roomId)});
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

        // append the new user to the game lsit if they are not already
        let game = await Game.findOne({RoomId: mongoose.Types.ObjectId(roomId)});
        if (game && !game.Players.find(i => i._id.toString() === userId.toString)) {
            await Game.updateOne(
                {RoomId: roomId},
                {$push: {Players: {
                    _id: userId,
                }}}
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
        return true;
    }
    catch (err) {
        console.log(err);
    }
}

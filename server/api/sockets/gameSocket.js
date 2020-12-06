const jwt = require ('jsonwebtoken');
const mongoose = require('mongoose'); 
const wordGenerator = require('../../helpers/wordGenerator');
const Room = require('../../models/Room');
const User = require('../../models/User');
const Game = require('../../models/Game');

let Timers = {};

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
        if (!await userHasConnected(io, socket, userId, roomId)) 
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
            startGame(io, socket, userId, roomId);
        });

        socket.on('word selected', data => {
            startTurn(io, socket, userId, roomId, data);
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
    if (game) {
        socket.emit('game in progress', {
            round: game.Round,
        });
    }

}

// checks if word is correct. If it is, marks the player and checks if all players have guessed correctly
async function newWord(io, socket, word, userId, roomId, userName) {
    let game = await Game.findOne({RoomId: roomId});
    if (game === null)
        return;
    
    let roundWord = game.RoundWord;
    let roundWordDifficulty = game.RoundWordDifficulty;

    //round has not started;
    if (roundWord === "")
        return;

    if (roundWord === word){
        io.to(roomId).emit('new guess', {name: userName, word: undefined, isCorrect: true});
        io.to(roomId).emit('correct guess', userId);

        await Game.updateOne({ 'Players._id': mongoose.Types.ObjectId(userId)},{
            $set: {'Players.$.HasGuessedCorrectly': true},
        });

        // check if all players have guessed corretly
        let game = await Game.findOne({RoomId: roomId});
        if (game !== null && !game.Players.find(i => !i.HasGuessedCorrectly)) {
            endTurn(io, roomId, game);
        }


    }
    else {
        io.to(roomId).emit('new guess', {name: userName, word: word, isCorrect: false});
    }
}

// starts a game and sets initial state
async function startGame(io, socket, userId, roomId) {
    try {
        // check that the calling user socket can actually start the game
        let room = await Room.findOne({_id: roomId});

        if (userId.toString() !== room.HostId.toString())
            return;
        
        
        let newGame = new Game({
            RoomId: roomId,
            CurrentRound: 1,
            TotalRounds: room.Rounds,
            Timer: room.Timer,
            CurrentTurn: room.HostId,
            RoundWord: "",
            RoundWordDifficulty: 1,
            Players: room.UserIds.map((i) => {
                return {
                    _id: i._id,
                    SocketId: i.SocketId
                }
            })
        });

        await newGame.save();
        io.to(roomId).emit('game start');

        switchTurns(io, socket.id, userId, roomId);

    }
    catch (err) {
        console.log(err);
    }
}

// sends events to the socket whos turn it is and asks them to pick a word
function switchTurns(io, socketId, userId, roomId) {
    io.to(socketId).emit('start your turn', wordGenerator.generateWords());
    io.to(roomId).emit('switch turns', {
        userId: userId
    });
}

// starts the turn of the current socket
async function startTurn(io, socket, userId, roomId, data) {

    try {
    
        let game = await Game.findOne({RoomId: roomId});

        if (game === null)
            return;

        // update current word turn, current player going
        await Game.updateOne({RoomId: roomId}, { 
            RoundWord: data.word.toLowerCase(),
            RoundWordDifficulty: data.difficulty,
            CurrentTurn: mongoose.Types.ObjectId(userId)
        });

        // mark the player as 'HasCompletedTurn' & 'HasGuessedCorrectly'
        await Game.updateOne({ 'Players._id': mongoose.Types.ObjectId(userId)},
            {
                $set: 
                {
                    'Players.$.HasCompletedTurn': true,
                    'Players.$.HasGuessedCorrectly': true
                }
            } ,
        );

        // broadcast to all sockets the a turn is starting
        socket.broadcast.to(roomId).emit('turn started', {
            round: game.CurrentRound,
            wordHint:  wordGenerator.convertWordToHint(data.word),
        });
        io.to(socket.id).emit('turn started', {
            round: game.CurrentRound,
            wordHint: data.word,
        });

        // create a timer socket for the time
        let timer = game.Timer;
        let timerInterval = setInterval(() => {
            io.to(roomId).emit('timer', timer);
            if (timer === 0) {
                endTurn(io, roomId);
                clearInterval(timerInterval);
            }
            timer--;
        }, 1000);

        // set here so it can be cleared elsewere is needed.
        Timers[roomId] = timerInterval;
    }
    catch (error) {
        console.log(error);
    }
}

// Ends the current turn. Checks if the round is over (all players have drawn).
// If so, end the round.
async function endTurn(io, roomId, game) {

    try {
        // clear interval
        let timer = Timers[roomId];
        clearInterval(timer);
        delete Timers[roomId];

        if (game === undefined)
            game = await Game.findOne({RoomId: roomId});
        
        io.to(roomId).emit('turn end', {
            word: game.RoundWord
        });

        // check if the round is over (all players have HasCompletedTurn)
        if (!game.Players.find(i => !i.HasCompletedTurn)) {
            endRound(io, roomId, game);
            return;
        }

        let nextPlayerId;
        let nextPlayerSocketId;
        let nextPlayerChosen = false;
        //reset all players 'HasGuessedCorrectly' and update next player
        for (let player of game.Players) {
            player.HasGuessedCorrectly = false;
            if (!player.HasCompletedTurn && !nextPlayerChosen) {
                nextPlayerId = player._id;
                nextPlayerSocketId = player.SocketId;
                game.CurrentTurn = nextPlayerId;
                nextPlayerChosen = true;
            }
        }
        game.RoundWord = "";
        await game.save();

        //in 5 seconds, start turn for the next player
        setTimeout(() => {
            switchTurns(io, nextPlayerSocketId, nextPlayerId, roomId);
        }, 5000);

    }
    catch (error) {
        console.log(error);
    }
}

async function endRound(io, roomId, game) {
    try {
        let round = game.CurrentRound;
        round++;
        
        if (round > game.TotalRounds) {
            // TODO: add top 3 scores;
            io.to(roomId).emit('game over');
            return;
        }

        // update game values
        game.CurrentRound = round;
        for (let player of game.Players) {
            player.HasGuessedCorrectly = false;
            player.HasCompletedTurn = false;
        }
        await game.save();

        let nextPlayerId = game.Players[0]._id;
        let nextPlayerSocketId = game.Players[0].SocketId;

        //in 5 seconds, start turn for the next player
        setTimeout(() => {
            switchTurns(io, nextPlayerSocketId, nextPlayerId, roomId);
        }, 5000);
    }
    catch (error) {
        console.log(error);
    }
}

// Connection Methods

async function userHasDisconnected(io, userId, roomId) {
    try {
        // remove user from the userIDs
        await Room.updateOne(
            { _id: roomId },
            { $pull: { UserIds: {_id: userId} } }
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
            let newHostId = room.UserIds[0]._id;
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

async function userHasConnected(io, socket, userId, roomId) {
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
                { $push: {UserIds: {
                    _id: mongoose.Types.ObjectId(userId), 
                    SocketId: socket.id
                }}}
            );

            // send the user joined event to all sockets joined to the room except the sender
            io.to(roomId).emit('user connected', 
                {
                    id: newUser._id,
                    name: newUser.Name,
                    emojiId: newUser.EmojiId,
                }
            );
        }

        // append the new user to the game list if they are not already
        let game = await Game.findOne({RoomId: mongoose.Types.ObjectId(roomId)});
        if (game && !game.Players.find(i => i._id.toString() === userId.toString)) {
            await Game.updateOne(
                {RoomId: roomId},
                {$push: {Players: {
                    _id: userId,
                    SocketId: socket.id,
                }}}
            );
        }

        return true;
    }
    catch (err) {
        console.log(err);
    }
}

const express = require('express');
const router = express.Router();
const auth = require('../auth');
const Room = require('../../models/Room');
const mongoose = require('mongoose'); 

router.post('/create', auth, async (req, res) => {
    var hostId = req.authData.id;

    try {
        let room = new Room({
            IsPrivate: false,
            Rounds: 1,
            Timer: 30,
            IsSpellCheck: false,
            HostId: mongoose.Types.ObjectId(hostId),
            UserIds: [mongoose.Types.ObjectId(hostId)],
        });

        // save room into database
        const savedRoom = await room.save();

        res.status(200).json({
            room: {
                id: savedRoom._id,
                isHost: true,
                isPrivate: savedRoom.IsPrivate,
                rounds: savedRoom.Rounds,
                timer: savedRoom.Timer,
                isSpellCheck: savedRoom.IsSpellCheck,
                hostId: savedRoom.HostId,
                userIds: [
                    hostId
                ]
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({Error:"Server error"});
    }


});

router.get('/find/:roomId', auth, async (req, res) => {
    var roomId = req.params.roomId;
    var callerId = req.authData.id;
    try {
        let room = await Room.findOne({_id: mongoose.Types.ObjectId(roomId)});
        if (room === undefined || room === null)
            return res.status(404).json({Error: "Room not found"});
        
        let isHost = room.HostId.toString() === callerId
        res.status(200).json({
            room: {
                id: room._id,
                isHost: isHost,
                isPrivate: room.IsPrivate,
                rounds: room.Rounds,
                timer: room.Timer,
                password: isHost ? room.Password : undefined,
                isSpellCheck: room.IsSpellCheck,
                hostId: room.HostId,
                userIds: room.UserIds,
            }
        });  
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({Error:"Server error"});
    }
    
});

router.get('/all', auth, async (req, res) => {
    var callerId = req.authData.id;
    
    try {        
        let rooms = [];
        for await (const room of Room.find()) {
            rooms.push({
                id: room._id,
                isHost: room.HostId.toString() === callerId,
                isPrivate: room.IsPrivate,
                rounds: room.Rounds,
                timer: room.Timer,
                isSpellCheck: room.IsSpellCheck,
                hostId: room.HostId,
                userIds: room.UserIds,
            });
        }
        res.status(200).json({
            rooms : rooms
        });  
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({Error:"Server error"});
    }
  
});

router.patch('/:roomId', auth, async (req, res) => {
    var callerId = req.authData.id;

    let roomId = mongoose.Types.ObjectId(req.params.roomId);
    try{
        let room = await Room.findById(roomId);

        // check that the room actually exists
        if (room === null || room === undefined)
            return res.status(404).json({Error: "Room not found"});

        //check that the calling user is actually the host
        if (callerId !== room.HostId.toString()) 
            return res.status(403).json({Error: "Forbidden"});
        
        // update all fields that are present
        if (req.body.isPrivate !== undefined) 
            room.IsPrivate = req.body.isPrivate;
        
        if (req.body.password !== undefined)
            room.Password = req.body.password;
        
        if (req.body.rounds !== undefined)
            room.Rounds = req.body.rounds;
        
        if (req.body.timer !== undefined)
            room.Timer = req.body.timer;
        
        if (req.body.isSpellCheck !== undefined)
            room.IsSpellCheck = req.body.isSpellCheck;
        
        await room.save();

        res.sendStatus(200);

    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({Error:"Server error"});
    }
});

router.post('/join/:roomId', auth, async (req, res) => {

    let roomId = req.params.roomId;
    let password = req.body.password;
    if (password === undefined)
        return res.status(400).json({Error: "Bad Request"});
    
    try {
        let room = await Room.findOne({_id: mongoose.Types.ObjectId(roomId)});
        if (room === null || room === undefined)
            return res.status(404).json({Error: "Not Found"});
        
        if (password === room.Password || !room.IsPrivate) 
            return res.sendStatus(200);
        
        res.sendStatus(400);
    }
    catch {
        return res.status(500).json({Error:"Server error"});
    }


});

module.exports = router;
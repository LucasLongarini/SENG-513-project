const jwt = require ('jsonwebtoken');

//TODO:
// Send user joined/left Events
// Send new host event if new host is assigned
// if no one left in the room, delete it from the db

module.exports = function(io) {
    io.on('connection', (socket) => {
        let userId;
        let roomId;
        try{
            const decoded = jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET);
            userId = decoded.id;
            roomId = socket.handshake.query.roomId;
        }
        catch {
            return socket.emit('disconnect');
        }

        socket.join(roomId);
        io.to(roomId).emit('user joined');

        // emit user joined to room with roomId


        socket.on('disconnect', () => {
            // emmit user left to room with roomId
        });

    });
}
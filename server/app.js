const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// middleware
app.use(express.json());


// DB
mongoose.connect(process.env.DB_CONNECTION, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("DB Connection Successful");
});

// Routes
const userRoutes = require('./api/routes/users');
const roomRoutes = require('./api/routes/room');
app.use('/user', userRoutes);
app.use('/room', roomRoutes);


// Serving web page
app.use(express.static(path.join(__dirname, "../client/build")));

app.get('/*', (req, res) => {
    //res.sendStatus(200);
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

// sockets
require('./api/sockets/gameSocket')(io);

// Server start
const port = process.env.PORT || 5000;
server.listen(port, ()=>{
    console.log("Server listening on port "+port)
});
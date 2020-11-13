const express = require('express');
const app = express();
const path = require('path');

// middleware
app.use(express.json());

// Routes
const userRoutes = require('./api/routes/users');
app.use('/user', userRoutes);

// Server start
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Server listening on port "+port)
});

// Serving web page
app.use(express.static(path.join(__dirname, "../client/build")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

// Error handling
app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status(404)
    next(error)
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
       .json({error:error.message})
});
const { request } = require('express');
const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) =>{
    if (req.path == '/user/register' || req.path == '/user/login')
        return next();
    
    var token = req.headers.token || req.body.token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.authData = decoded
        next()
    }catch(error){
        return res.status(400).json({Error: "Authentication error"})
    }
}
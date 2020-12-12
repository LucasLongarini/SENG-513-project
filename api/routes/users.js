const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const auth = require('../auth');

router.post('/register', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var emojiId = req.body.emojiId;
    var isGuest = req.body.isGuest;

    if (!name || name.length == 0 || emojiId === undefined || isGuest === undefined) 
        return res.status(400).json({Error: "Bad request"});
    
    try {
        isGuest = Boolean(isGuest);
        let user;
        if (!isGuest) {
            if (!email || !password) 
                return res.status(400).json({Error: "Bad request"});
            
            // Check if that email is in use
            let docs = await User.find({Email: email});
            if (docs.length)
                return res.status(400).json({Error: "User already exists"});

            let hash = await bcrypt.hash(password, 10);

            email = email.toLowerCase();
            user = new User({
                Name: name,
                Email: email,
                Password: hash,
                EmojiId: emojiId,
                IsGuest: isGuest
            });
        }
        else {
            user = new User({
                Name: name,
                EmojiId: emojiId,
                IsGuest: isGuest
            });
        }
        
        // Insert into mongoDB
        const savedUser = await user.save();
        
        // Sign a new jwt
        const token = jwt.sign({
            id: savedUser._id, 
            isGuest: isGuest
        }, process.env.JWT_SECRET);

        res.status(200).json({
            user: {
                id: savedUser._id,
                email: savedUser.Email,
                name: savedUser.Name,
                emojiId: savedUser.EmojiId,
                isGuest: savedUser.IsGuest
            },
            token: token
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({Error:"Server error"});
    }        

});

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password)
        return res.status(400).json({Error: "Bad request"});

    try {
        email = email.toLowerCase();
        let savedUser = await User.findOne({Email:email});

        // user does not exist with that email
        if (savedUser === null)
            return res.status(404).json({Error: "User not found"});
        
        // make sure user has a password
        if (savedUser.Password === null || savedUser.Password === undefined)
            return res.status(500).json({Error: "Server error"});

        let correctPassword = await bcrypt.compare(password, savedUser.Password);

        if (!correctPassword)
            return res.status(400).json({Error: "Authentication error"})

        // Sign a new jwt
        const token = jwt.sign({
            id: savedUser._id, 
            isGuest: savedUser.IsGuest
        }, process.env.JWT_SECRET);

        res.status(200).json({
            user: {
                id: savedUser._id,
                email: savedUser.Email,
                name: savedUser.Name,
                emojiId: savedUser.EmojiId,
                isGuest: savedUser.IsGuest
            },
            token: token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({Error: "Server error"});
    }
});

router.get('/verify', auth, async (req, res) => {
    // Because of the auth middleware if the request makes it here, the token is verified
    res.sendStatus(200);
});

module.exports = router;
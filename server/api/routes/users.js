const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// TODO: need to check if user with existing email already exists
router.post('/register', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var emojiId = req.body.emojiId;
    var isGuest = req.body.isGuest;

    if (!name || !emojiId || isGuest === undefined) 
        return res.status(400).json({Error: "Bad request"});
    
    try {
        isGuest = Boolean(isGuest);
        let user;
        if (!isGuest) {
            if (!email || !password) 
                return res.status(400).json({Error: "Bad request"});

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
    catch {
        return res.status(500).json({Error:"Server error"});
    }        

});

router.get('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password)
        return res.status(400).json({Error: "Bad request"});

    try {
        email = email.toLowerCase();
        let savedUser = await User.findOne({"Email":email});
                
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
    catch {
        return res.status(500).json({Error: "Server error"});
    }
});

module.exports = router;
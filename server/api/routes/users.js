const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

router.post('/register', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var emojiId = req.body.emojiId;
    var isGuest = req.body.isGuest;

    if (!email || !password || !name || !emojiId || !isGuest) 
        return res.status(400).json({Error: "Bad request"});
        
    email = email.toLowerCase();
    try {
        let hash = await bcrypt.hash(password, 10);

        // Insert into mongoDB
        const user = new User({
            Name: name,
            Email: email,
            Password: hash,
            EmojiId: emojiId,
            IsGuest: isGuest
        });

        const savedUser = await user.save();
        
        console.log(savedUser);

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

module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var emojiId = req.body.emojiId;
    var isGuest = req.body.isGuest;

    if (!email || !password || !name || !emojiId || !isGuest) 
        return res.status(400).json({Error: "Bad request"});
    
    bcrypt.hash(password, 10, (err, hash) => {
        if (err)
            return res.status(500).json({Error:"Server error"});
        
        // Insert into mongoDB
        //TODO

        // Sign a new jwt
        const token = jwt.sign({
            id: 1, 
            isGuest: isGuest
        }, process.env.JWT_SECRET);

        res.status(200).json({
            user: {
                id: 1,
                email: email,
                name: name,
                emojiId: emojiId,
            },
            token: token
        });
    });

});

module.exports = router;
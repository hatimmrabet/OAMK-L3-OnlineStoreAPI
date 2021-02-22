const express = require('express');
const router = express.Router();
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const users =  require('../services/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecretKey = require('../jwt-key.json');

passport.use(new BasicStrategy(
  function(username, password, done) {
    const user = users.getUserByUsername(username);
    if(user == undefined) {
        // Username not found
        // console.log("HTTP Basic username not found");
        return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match */
    if(bcrypt.compareSync(password, user.password) == false) {
        // Password does not match
        //console.log("HTTP Basic password not matching username");
        return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

let options = {}

/* Configure the passport-jwt module to expect JWT in headers from Authorization field as Bearer token */
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

/* This is the secret signing key.You should NEVER store it in code  */
options.secretOrKey = jwtSecretKey.secret;

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    /*
    console.log("Processing JWT payload for token content:");
    console.log(jwt_payload);
    */
    /* Here you could do some processing based on the JWT payload.For example check if the key is still valid based on expires property.*/
    const now = Date.now() / 1000;
    if(jwt_payload.exp > now) {
        done(null, jwt_payload.user);
    }
    else {  // expired
        done(null, false);
    }
}));

router.get('/',
    passport.authenticate('basic', { session: false }),
    (req, res) => {
        const body = {
            id: req.user.id,
            username: req.user.username,
            email : req.user.email
        };
        const payload = { user : body };
        const options = { expiresIn: '1d' }

    /* Sign the token with payload, key and options.
        Detailed documentation of the signing here:
        https://github.com/auth0/node-jsonwebtoken#readme */
    const token = jwt.sign(payload, jwtSecretKey.secret, options);
    return res.json({ token });
});


function getUsername(){
    return req.user.username;
};

module.exports = {
    router,
    getUsername: (req) => getUsername(req)
};
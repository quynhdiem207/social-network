const User = require('../models/User');
const authConfig = require('@config/auth')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = authConfig.SECRET_KEY;

module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne(jwt_payload).lean()
        .then(user => {
            if (user)
                return done(null, user);
            return done(null, false);
        })
        .catch(err => {
            return done(err, false);
        })
})
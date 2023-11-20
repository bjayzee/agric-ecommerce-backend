const passport = require('passport');
const { Seller, Buyer } = require('../models/index');
const AgrikoUser = require('../models/AgrikoUser');

const JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt;


const jwtOptions = {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload, done) => {
        try {
                if (!payload) {
                        return done(null, false);
                }

                let user;

                if (payload.role === 'seller') {
                        user = await Seller.findByPk(payload.id);
                } else if (payload.role === 'buyer') {
                        user = await Buyer.findByPk(payload.id);
                }

                if (!user) {
                        return done(null, false);
                }

                done(null, user);
        } catch (error) {
                return done(error, false);
        }
};

passport.use(new JwtStrategy(jwtOptions, jwtVerify));

const auth = passport.authenticate('jwt', { session: false });

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] })

module.exports = {
        passport,
        auth,
        googleAuth
} 
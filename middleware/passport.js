const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Seller } = require('../models/index');
const { verifyToken } = require('../config/token')


const jwtOptions = {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
        
        try {
                const token = verifyToken(payload);
                if(!token){
                        return done(null, false);
                }
                if(token.role === 'seller'){
                        const user = await Seller.findByPk(token.id);
                        if (!user) {
                                return done(null, false);
                        }
                        done(null, user);
                }
                
        } catch (error) {
                done(error, false);
        }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
        jwtStrategy,
};

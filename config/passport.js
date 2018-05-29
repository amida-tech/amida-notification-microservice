
import {
    Strategy as JwtStrategy,
    ExtractJwt,
} from 'passport-jwt';
import config from './config';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
    // passReqToCallback: true,
};

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwtPayload, done) => done(null, jwtPayload)));
};

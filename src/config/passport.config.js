import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import {
    registerUser,
    loginUser
} from '../services/sessions.services.js';

const cookieExtractor = (req) => {
    return req?.cookies?.currentUser || null;
};

export const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            },
            async (req, email, password, done) => {
                try {
                    const user = await registerUser({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email,
                        password
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            },
            async (email, password, done) => {
                try {
                    const user = await loginUser({
                        email,
                        password
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        'current',
        new JwtStrategy(
            {
                jwtFromRequest: cookieExtractor,
                secretOrKey: process.env.JWT_SECRET
            },
            async (jwtPayload, done) => {
                try {
                    return done(null, {
                        id: jwtPayload.id,
                        email: jwtPayload.email,
                        role: jwtPayload.role
                    });
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};
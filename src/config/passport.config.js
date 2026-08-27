import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import * as userRepository from '../repositories/users.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const cookieExtractor = (req) => {
    if (req?.cookies?.currentUser) {
        return req.cookies.currentUser;
    }

    return null;
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
                    const { first_name, last_name } = req.body;

                    if (!first_name || !last_name || !email || !password) {
                        const error = new Error('Faltan campos obligatorios');
                        error.statusCode = 400;
                        return done(error);
                    }

                    const normalizedEmail = email.trim().toLowerCase();
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (!emailRegex.test(normalizedEmail)) {
                        const error = new Error('El email no tiene un formato válido');
                        error.statusCode = 400;
                        return done(error);
                    }

                    if (password.length < 8) {
                        const error = new Error('La contraseña debe tener al menos 8 caracteres');
                        error.statusCode = 400;
                        return done(error);
                    }

                    const existingUser = await userRepository.findByEmail(normalizedEmail);

                    if (existingUser) {
                        const error = new Error('El email ya está registrado');
                        error.statusCode = 409;
                        return done(error);
                    }

                    const hashedPassword = await hashPassword(password);

                    const user = await userRepository.createUser({
                        first_name: first_name.trim(),
                        last_name: last_name.trim(),
                        email: normalizedEmail,
                        password: hashedPassword,
                        role: 'user'
                    });

                    return done(null, {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role: user.role
                    });
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
                    const normalizedEmail = email.trim().toLowerCase();

                    const user = await userRepository.findByEmailWithPassword(
                        normalizedEmail
                    );

                    if (!user) {
                        return done(null, false, {
                            message: 'Credenciales inválidas'
                        });
                    }

                    const passwordMatch = await comparePassword(
                        password,
                        user.password
                    );

                    if (!passwordMatch) {
                        return done(null, false, {
                            message: 'Credenciales inválidas'
                        });
                    }

                    return done(null, {
                        id: user._id,
                        email: user.email,
                        role: user.role
                    });
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
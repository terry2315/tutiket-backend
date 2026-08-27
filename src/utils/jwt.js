import jwt from 'jsonwebtoken';
import ms from 'ms';

const getExpiresIn = () => {
    return process.env.JWT_EXPIRES_IN || '1h';
};

export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: getExpiresIn() }
    );
};

export const getJwtCookieMaxAge = () => {
    const maxAge = ms(getExpiresIn());

    if (typeof maxAge !== 'number') {
        throw new Error('JWT_EXPIRES_IN tiene un formato inválido');
    }

    return maxAge;
};

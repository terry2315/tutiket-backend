import {
    generateToken,
    getJwtCookieMaxAge
} from '../utils/jwt.js';

import {
    toAuthUserDTO,
    toUserDTO
} from '../dto/user.dto.js';

export const register = (req, res) => {
    return res.status(201).json({
        status: 'success',
        payload: toUserDTO(req.user)
    });
};

export const login = (req, res, next) => {
    try {
        const user = toAuthUserDTO(req.user);

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.cookie('currentUser', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: getJwtCookieMaxAge(),
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Login correcto'
        });
    } catch (error) {
        next(error);
    }
};

export const current = (req, res) => {
    return res.status(200).json({
        status: 'success',
        payload: toAuthUserDTO(req.user)
    });
};

export const logout = (req, res) => {
    res.clearCookie('currentUser', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({
        status: 'success',
        message: 'Sesión cerrada'
    });
};
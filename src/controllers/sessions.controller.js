import {
    generateToken,
    getJwtCookieMaxAge
} from '../utils/jwt.js';

export const register = (req, res) => {
    return res.status(201).json({
        status: 'success',
        payload: req.user
    });
};

export const login = (req, res) => {
    try {
        const user = req.user;

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
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};

export const current = (req, res) => {
    return res.status(200).json({
        status: 'success',
        payload: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
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
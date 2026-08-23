import { registerUser, loginUser } from '../services/sessions.service.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            status: 'success',
            payload: user
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            status: 'error',
            message:
                statusCode === 500
                    ? 'Error interno del servidor'
                    : error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        res.cookie('currentUser', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            status: 'success',
            message: 'Login correcto'
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            status: 'error',
            message:
                statusCode === 500
                    ? 'Error interno del servidor'
                    : error.message
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
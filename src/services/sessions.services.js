import * as userRepository from '../repositories/users.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { createError } from '../utils/app.error.js';


export const registerUser = async ({
    first_name,
    last_name,
    email,
    password
}) => {
    if (!first_name || !last_name || !email || !password) {
        throw createError('Faltan campos obligatorios', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        throw createError('El email no tiene un formato válido', 400);
    }

    if (password.length < 8) {
        throw createError(
            'La contraseña debe tener al menos 8 caracteres',
            400
        );
    }

    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
        throw createError('El email ya está registrado', 409);
    }

    const hashedPassword = await hashPassword(password);

    return await userRepository.createUser({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user'
    });
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw createError('Credenciales inválidas', 401);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userRepository.findByEmailWithPassword(
        normalizedEmail
    );

    if (!user) {
        throw createError('Credenciales inválidas', 401);
    }

    const passwordMatch = await comparePassword(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw createError('Credenciales inválidas', 401);
    }

    return user;
};
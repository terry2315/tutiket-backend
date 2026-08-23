import * as userRepository from '../repositories/users.repository.js';
import { hashPassword } from '../utils/hash.js';
import { comparePassword } from '../utils/hash.js';

export const registerUser = async (data) => {
    const {
        first_name,
        last_name,
        email,
        password
    } = data;

    // 1. Validar campos obligatorios
    if (!first_name || !last_name || !email || !password) {
        const error = new Error('Faltan campos obligatorios');
        error.statusCode = 400;
        throw error;
    }

    // 2. Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        const error = new Error('El email no tiene un formato válido');
        error.statusCode = 400;
        throw error;
    }

    // 4. Validar longitud mínima de contraseña
    if (password.length < 8) {
        const error = new Error(
            'La contraseña debe tener al menos 8 caracteres'
        );
        error.statusCode = 400;
        throw error;
    }

    // 5. Buscar usuario existente
    const existingUser = await userRepository.findByEmail(
        normalizedEmail
    );

    if (existingUser) {
        const error = new Error('El email ya está registrado');
        error.statusCode = 409;
        throw error;
    }

    // 6. Proteger la contraseña
    const hashedPassword = await hashPassword(password);

    // 7. Preparar los datos que realmente se guardarán
    const userData = {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user'
    };

    // 8. Persistir usuario
    const user = await userRepository.createUser(userData);

    // 9. Devolver una respuesta segura
    return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    };
};

export const loginUser = async (data) => {
    const { email, password } = data;

    // 1. Validar presencia de credenciales
    if (!email || !password) {
        const error = new Error('Email y contraseña son obligatorios');
        error.statusCode = 400;
        throw error;
    }

    // 2. Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Buscar usuario incluyendo excepcionalmente el password
    const user = await userRepository.findByEmailWithPassword(
        normalizedEmail
    );

    // 4. Mensaje genérico si el usuario no existe
    if (!user) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    // 5. Comparar password recibido con hash almacenado
    const passwordMatch = await comparePassword(
        password,
        user.password
    );

    // 6. Mismo mensaje si el password es incorrecto
    if (!passwordMatch) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
    }

    // 7. Retornar exclusivamente los datos necesarios para el JWT
    return {
        id: user._id,
        email: user.email,
        role: user.role
    };
};
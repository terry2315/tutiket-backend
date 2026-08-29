import * as userRepository from '../repositories/users.repository.js';

export const getUsers = async (req, res) => {
    try {
        const users = await userRepository.findAllUsers();

        const safeUsers = users.map((user) => ({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }));

        return res.status(200).json({
            status: 'success',
            payload: safeUsers
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};
import * as userRepository from '../repositories/users.repository.js';

export const getAllUsers = async () => {
    return await userRepository.findAllUsers();
};
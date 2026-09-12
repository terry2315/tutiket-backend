import { getAllUsers } from '../services/user.services.js';
import { toUsersDTO } from '../dto/user.dto.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        return res.status(200).json({
            status: 'success',
            payload: toUsersDTO(users)
        });
    } catch (error) {
        next(error);
    }
};
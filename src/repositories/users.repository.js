
import * as userDao from '../dao/users.dao.js';

export const findByEmail = async (email) => {
    return await userDao.findOne({ email });
};

export const createUser = async (data) => {
    return await userDao.create(data);
};
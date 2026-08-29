import * as userDao from '../dao/users.dao.js';

export const findByEmail = async (email) => {
    return await userDao.findOne({ email });
};

export const findByEmailWithPassword = async (email) => {
    return await userDao.findOneWithPassword({ email });
};

export const findAllUsers = async () => {
    return await userDao.findAll();
};

export const createUser = async (data) => {
    return await userDao.create(data);
};
import User from '../models/User.js';

export const findOne = async (filter) => {
    return await User.findOne(filter);
};

export const create = async (data) => {
    return await User.create(data);
};

